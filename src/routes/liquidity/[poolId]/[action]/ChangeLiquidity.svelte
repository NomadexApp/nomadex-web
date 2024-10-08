<script lang="ts">
	import { contracts, knownPools, TokenType, type Pool, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { PoolClient } from '../../../../contracts/clients/PoolClient';
	import { convertDecimals } from '$lib/utils/numbers';
	import { get } from 'svelte/store';
	import { SmartAssetClient } from '../../../../contracts/clients/SmartAssetClient';
	import { PoolFactoryClient } from '../../../../contracts/clients/PoolFactoryClient';
	import { page } from '$app/stores';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { addNotification } from '$lib/components/Notify.svelte';

	export let onUpdate = () => {};

	async function buildDepositTxn(pool: { id: number }, token: { id: number; type: TokenType }, amount: bigint) {
		if (token.type === TokenType.Default) {
			return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				from: get(connectedAccount),
				to: algosdk.getApplicationAddress(pool.id),
				amount: amount, //convertDecimals(inputTokenA * 1e6, 6, tokenA.decimals),
				suggestedParams: await nodeClient.getTransactionParams().do(),
			});
		} else if (token.type === TokenType.ASA) {
			return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
				assetIndex: token.id,
				from: get(connectedAccount),
				to: algosdk.getApplicationAddress(pool.id),
				amount: amount, //convertDecimals(inputTokenA * 1e6, 6, tokenA.decimals),
				suggestedParams: await nodeClient.getTransactionParams().do(),
			});
		} else if (token.type === TokenType.ARC200) {
			const smartAssetClient = new SmartAssetClient(
				{
					id: token.id,
					resolveBy: 'id',
					sender: getTransactionSignerAccount(),
				},
				nodeClient
			);
			const { transaction } = await smartAssetClient.arc200Transfer(
				{
					to: algosdk.getApplicationAddress(pool.id),
					value: amount,
				},
				{ sendParams: { populateAppCallResources: true, skipSending: true } }
			);
			return transaction;
		}
		throw Error('');
	}

	type AddLiquidityOpts = { pool: Pool; tokenA: Token; tokenB: Token; inputTokenA: number; inputTokenB: number };
	async function addLiquidity({ pool, tokenA, tokenB, inputTokenA, inputTokenB }: AddLiquidityOpts) {
		const remove = addNotification('pending', `Adding liquidity...`);

		const poolClient = new PoolClient(
			{
				id: pool.id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		try {
			const alphaTxn = await buildDepositTxn(pool, tokenA, convertDecimals(inputTokenA * 1e6, 6, tokenA.decimals));
			const betaTxn = await buildDepositTxn(pool, tokenB, convertDecimals(inputTokenB * 1e6, 6, tokenB.decimals));

			const resp = await poolClient.addLiquidity(
				{
					alphaTxn: alphaTxn,
					betaTxn: betaTxn,
				},
				{
					sendParams: { populateAppCallResources: true },
				}
			);

			onUpdate();

			return resp.return;
		} catch (e) {
			console.error(e);
		} finally {
			remove();
		}
	}

	type RemoveLiquidityOpts = { pool: Pool; inputTokenLpt: number };
	async function removeLiquidity({ pool, inputTokenLpt }: RemoveLiquidityOpts) {
		const remove = addNotification('pending', `Removing liquidity...`);

		const poolClient = new PoolClient(
			{
				id: pool.id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		try {
			const resp = await poolClient.removeLiquidity(
				{
					lptAmount: convertDecimals(inputTokenLpt * 1e6, 6, 6),
				},
				{
					sendParams: { populateAppCallResources: true },
				}
			);

			onUpdate();
			return resp.return;
		} catch (e) {
			console.error(e);
		} finally {
			remove();
		}
	}

	const factoryClient = new PoolFactoryClient(
		{
			id: contracts[PUBLIC_NETWORK].poolFcatory,
			resolveBy: 'id',
			sender: getTransactionSignerAccount(),
		},
		nodeClient
	);
	async function updateContract() {
		const { transaction } = await factoryClient.setPoolManager(
			{
				manager: $connectedAccount,
				poolId: Number($page.params.poolId),
			},
			{ sendParams: { skipSending: true } }
		);
		console.log('updated manager');
		const poolClient = new PoolClient(
			{
				id: Number($page.params.poolId),
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		const composer = await poolClient
			.compose()
			.update.updateApplication({})
			.grant({ manager: algosdk.getApplicationAddress(contracts[PUBLIC_NETWORK].poolFcatory).toString() });
		let atc = await composer.atc();
		let txns: algosdk.Transaction[] = [];
		for (const txn of [transaction, ...atc.buildGroup().map((t) => t.txn)]) {
			txn.group = undefined;
			txns.push(txn);
		}
		atc = new algosdk.AtomicTransactionComposer();
		for (const txn of txns) {
			atc.addTransaction({ txn, signer: algosdk.makeEmptyTransactionSigner() });
		}
		atc = await populateAppCallResources(atc, nodeClient);
		txns = atc.buildGroup().map((t) => t.txn);
		const signed = await getTransactionSignerAccount().signer(
			txns,
			txns.map((_, i) => i)
		);

		const { txId } = await nodeClient.sendRawTransaction(signed).do();

		const res = await algosdk.waitForConfirmation(nodeClient, txId, 3);

		console.log('Updated:', res);
	}
</script>

<slot {addLiquidity} {removeLiquidity} />
{#await factoryClient.getGlobalState() then res}
	{#if algosdk.encodeAddress(res.warden?.asByteArray() ?? Uint8Array.from([])) === $connectedAccount}
		<br />
		<button class="text-sm absolute left-[50vw] translate-x-[-50%]" on:click={updateContract}>Update Contract</button>
	{/if}
{/await}
