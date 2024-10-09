<script lang="ts" context="module">
	export type SwapAlphaBetaOpts = { pool: Pool; tokenA: Token; tokenB: Token; inputTokenA: number; minOfTokenB: number; isDirectionAlphaToBeta: boolean };
</script>

<script lang="ts">
	import { contracts, TokenType, type Pool, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { convertDecimals } from '$lib/utils/numbers';
	import { get } from 'svelte/store';
	import { SmartAssetClient } from '../../../../../contracts/clients/SmartAssetClient';
	import { PoolClient } from '../../../../../contracts/clients/PoolClient';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { MySmartAsset } from '$lib/MySmartAsset';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';

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

	async function handleSwap({ pool, tokenA, tokenB, inputTokenA, minOfTokenB, isDirectionAlphaToBeta }: SwapAlphaBetaOpts) {
		const remove = addNotification(
			'pending',
			`Swapping ${isDirectionAlphaToBeta ? tokenA.symbol : tokenB.symbol} for ${isDirectionAlphaToBeta ? tokenB.symbol : tokenA.symbol}...`
		);

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

		const params = await nodeClient.getTransactionParams().do();

		async function makeOptinTxns(token: Token): Promise<algosdk.Transaction[]> {
			const txns: algosdk.Transaction[] = [];
			if (token.type === TokenType.ASA) {
				let isOptedIn = false;

				try {
					const info = await nodeClient.accountAssetInformation($connectedAccount, token.id).do();
					if (typeof info?.['asset-holding']?.amount !== 'undefined') isOptedIn = true;
				} catch (e) {}

				if (!isOptedIn) {
					txns.push(
						algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
							assetIndex: token.id,
							from: $connectedAccount,
							to: $connectedAccount,
							amount: 0,
							suggestedParams: params,
						})
					);
				}
			} else if (token.type === TokenType.ARC200) {
				const factoryAddress = algosdk.getApplicationAddress(contracts[PUBLIC_NETWORK].poolFcatory);
				const factoryBalance = await MySmartAsset.from(token.id).arc200BalanceOf(factoryAddress);
				const userBalance = await MySmartAsset.from(token.id).arc200BalanceOf($connectedAccount);
				const getTxns = async (address: string) => {
					const client = new SmartAssetClient(
						{
							id: token.id,
							resolveBy: 'id',
							sender: {
								addr: $connectedAccount,
								signer: algosdk.makeEmptyTransactionSigner(),
							},
						},
						nodeClient
					);
					return [
						algosdk.makePaymentTxnWithSuggestedParamsFromObject({
							from: $connectedAccount,
							to: algosdk.getApplicationAddress(token.id),
							amount: 28500,
							suggestedParams: params,
						}),
						(await client.arc200Transfer({ to: address, value: 0 }, { sendParams: { skipSending: true } })).transaction,
					];
				};
				if (factoryBalance < 1n) {
					txns.push(...(await getTxns(factoryAddress)));
				}
				if (userBalance < 1n) {
					txns.push(...(await getTxns($connectedAccount)));
				}
			}
			return txns;
		}

		try {
			const txns: algosdk.Transaction[] = [];
			const optinTxns = await makeOptinTxns(isDirectionAlphaToBeta ? tokenB : tokenA);
			txns.push(...optinTxns);

			if (isDirectionAlphaToBeta) {
				const { transactions } = await poolClient.swapAlphaToBeta(
					{
						alphaTxn: args.txn,
						minBetaAmount: args.minAmount,
					},
					{
						sendParams: { skipSending: true },
					}
				);
				txns.push(...transactions);
			} else {
				const { transactions } = await poolClient.swapBetaToAlpha(
					{
						betaTxn: args.txn,
						minAlphaAmount: args.minAmount,
					},
					{
						sendParams: { skipSending: true },
					}
				);
				txns.push(...transactions);
			}

			let atc = new algosdk.AtomicTransactionComposer();
			const mpt = algosdk.makeEmptyTransactionSigner();
			for (const txn of txns) {
				txn.group = undefined;
				atc.addTransaction({ txn: txn, signer: mpt });
			}
			atc.buildGroup();
			atc = await populateAppCallResources(atc, nodeClient);
			const finalTxns = atc.buildGroup().map(({ txn }) => txn);
			const signed = await getTransactionSignerAccount().signer(finalTxns, []);

			await nodeClient.sendRawTransaction(signed).do();
			const result = await algosdk.waitForConfirmation(nodeClient, finalTxns.at(-1)?.txID() ?? '', 3);

			onUpdate();
			const log: Uint8Array = result.logs.find((log: Uint8Array) => log.length === 36);
			if (log) {
				return <bigint>algosdk.ABIType.from('uint256').decode(log.slice(4));
			}
		} catch (e) {
			console.error(e);
		} finally {
			remove();
		}
	}
</script>

<slot {handleSwap} />
