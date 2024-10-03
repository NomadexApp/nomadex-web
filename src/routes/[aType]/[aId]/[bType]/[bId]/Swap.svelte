<script lang="ts" context="module">
	export type SwapAlphaBetaOpts = { pool: Pool; tokenA: Token; tokenB: Token; inputTokenA: number; minOfTokenB: number; isDirectionAlphaToBeta: boolean };
</script>

<script lang="ts">
	import { TokenType, type Pool, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { convertDecimals } from '$lib/utils/numbers';
	import { get } from 'svelte/store';
	import { SmartAssetClient } from '../../../../../contracts/clients/SmartAssetClient';
	import { PoolClient } from '../../../../../contracts/clients/PoolClient';

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

	async function handleSwap({ pool, tokenA, tokenB, inputTokenA, minOfTokenB, isDirectionAlphaToBeta }: SwapAlphaBetaOpts) {
		const poolClient = new PoolClient(
			{
				id: pool.id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		const args = {
			txn: await buildDepositTxn(pool, tokenA, convertDecimals(inputTokenA * 1e6, 6, tokenA.decimals)),
			minAmount: 0n,
		};

		const opts = {
			sendParams: { populateAppCallResources: true },
		};

		let resp: { return?: bigint | undefined };

		if (isDirectionAlphaToBeta) {
			resp = await poolClient.swapAlphaToBeta(
				{
					alphaTxn: args.txn,
					minBetaAmount: args.minAmount,
				},
				opts
			);
		} else {
			resp = await poolClient.swapBetaToAlpha(
				{
					betaTxn: args.txn,
					minAlphaAmount: args.minAmount,
				},
				opts
			);
		}

		return resp.return;
	}
</script>

<slot {handleSwap} />
