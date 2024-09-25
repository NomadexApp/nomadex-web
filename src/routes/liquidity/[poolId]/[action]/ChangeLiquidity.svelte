<script lang="ts">
	import { contracts, knownPools, TokenType, type Pool, type Token } from '$lib';
	import { nodeClient, nodeClientAllowsCompile } from '$lib/_shared';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { PoolClient } from '../../../../contracts/clients/PoolClient';
	import { convertDecimals } from '$lib/numbers';
	import { get } from 'svelte/store';
	import { SmartAssetClient } from '../../../../contracts/clients/SmartAssetClient';
	import { PoolFactoryClient } from '../../../../contracts/clients/PoolFactoryClient';

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
		const poolClient = new PoolClient(
			{
				id: pool.id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

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

		return resp.return;
	}

	type RemoveLiquidityOpts = { pool: Pool; inputTokenLpt: number };
	async function removeLiquidity({ pool, inputTokenLpt }: RemoveLiquidityOpts) {
		const poolClient = new PoolClient(
			{
				id: pool.id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		const resp = await poolClient.removeLiquidity(
			{
				lptAmount: convertDecimals(inputTokenLpt * 1e6, 6, 6),
			},
			{
				sendParams: { populateAppCallResources: true },
			}
		);

		return resp.return;
	}

	async function updateContract() {
		const factoryClient = new PoolFactoryClient(
			{
				id: contracts.poolFcatory,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClientAllowsCompile
		);
		await factoryClient.setPoolManager(
			{
				manager: $connectedAccount,
				poolId: $knownPools[1].id,
			},
			{ sendParams: { populateAppCallResources: true } }
		);
		console.log('updated manager');
		const poolClient = new PoolClient(
			{
				id: $knownPools[0].id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClientAllowsCompile
		);

		const resp = await poolClient.update.updateApplication({});
		console.log('Updated:', resp);
	}
</script>

<!-- <button on:click={updateContract}>Update Contract</button> -->
<slot {addLiquidity} {removeLiquidity} />
