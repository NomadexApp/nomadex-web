<script lang="ts">
	import { contracts, type Pool, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { PoolClient } from '$lib/../contracts/clients/PoolClient';
	import { convertDecimals } from '$lib/utils/numbers';
	import { PoolFactoryClient } from '$lib/../contracts/clients/PoolFactoryClient';
	import { page } from '$app/stores';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { MyPool } from 'nomadex-client';
	import type { Snippet } from 'svelte';

	let {
		onUpdate = () => {},
		child,
	}: {
		onUpdate: () => void;
		child: Snippet<[typeof addLiquidity, typeof removeLiquidity]>;
	} = $props();

	type AddLiquidityOpts = { pool: Pool; tokenA: Token; tokenB: Token; inputTokenA: number; inputTokenB: number };
	async function addLiquidity({ pool, tokenA, tokenB, inputTokenA, inputTokenB }: AddLiquidityOpts) {
		const remove = addNotification('pending', `Adding liquidity...`);

		try {
			const signer = getTransactionSignerAccount();
			const poolClient = new MyPool(pool.id, PUBLIC_NETWORK as any, nodeClient as any, signer);
			const result = await poolClient.addLiquidity(
				tokenA,
				tokenB,
				convertDecimals(Math.floor(inputTokenA * 1e6), 6, tokenA.decimals),
				convertDecimals(Math.floor(inputTokenB * 1e6), 6, tokenB.decimals)
			);
			onUpdate();
			return result;
		} catch (e) {
			console.error(e);
			if (e instanceof Error) {
				addNotification('error', e.message, 15000);
			}
		} finally {
			remove();
		}
	}

	type RemoveLiquidityOpts = { pool: Pool; inputTokenLpt: number };
	async function removeLiquidity({ pool, inputTokenLpt }: RemoveLiquidityOpts) {
		const remove = addNotification('pending', `Removing liquidity...`);

		try {
			const signer = getTransactionSignerAccount();
			const poolClient = new MyPool(pool.id, PUBLIC_NETWORK as any, nodeClient as any, signer);
			const result = await poolClient.removeLiquidity(convertDecimals(Math.floor(inputTokenLpt * 1e6), 6, 6));
			onUpdate();
			return result;
		} catch (e) {
			console.error(e);
			if (e instanceof Error) {
				addNotification('error', e.message, 15000);
			}
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

{@render child(addLiquidity, removeLiquidity)}

{#await factoryClient.getGlobalState() then res}
	{#if algosdk.encodeAddress(res.warden?.asByteArray() ?? Uint8Array.from([])) === $connectedAccount}
		<br />
		<button class="text-sm absolute left-[50vw] translate-x-[-50%]" onclick={updateContract}>Update Contract</button>
	{/if}
{/await}
