<script lang="ts">
	import { contracts, knownTokens, TokenType, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { openModal } from '$lib/components/modal/Modal.svelte';
	import SelectTokenModal from '$lib/components/modal/SelectTokenModal.svelte';
	import { getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { PoolFactoryClient } from '../../../contracts/clients/PoolFactoryClient';
	import { populateAppCallResources } from '@algorandfoundation/algokit-utils';

	let tokenA: Token = $knownTokens[0];
	let tokenB: Token = $knownTokens[1];

	const SCALE = 100_000_000_000_000;

	function strToFixedBytes(str: string, length: number) {
		str = str.slice(0, length);
		const uint8Array = new TextEncoder().encode(str);
		const restArray = new Uint8Array(length - uint8Array.length);

		return Uint8Array.from([...uint8Array, ...restArray]);
	}

	async function setFee() {
		console.log('setting');
		const signer = getTransactionSignerAccount();

		const client = new PoolFactoryClient(
			{
				id: contracts.poolFcatory,
				resolveBy: 'id',
				sender: signer,
			},
			nodeClient
		);

		await client.setFee({
			fee: 2_000_000,
		});
		console.log('done setting');
	}

	async function createPool() {
		if (!tokenA || !tokenB) throw Error('must select assets');
		const signer = getTransactionSignerAccount();
		const client = new PoolFactoryClient(
			{
				id: contracts.poolFcatory,
				resolveBy: 'id',
				sender: signer,
			},
			nodeClient
		);
		const aType = tokenA.type === TokenType.Default ? 0 : tokenA.type === TokenType.ASA ? 1 : tokenA.type === TokenType.ARC200 ? 2 : -1;

		const bType = tokenB.type === TokenType.Default ? 0 : tokenB.type === TokenType.ASA ? 1 : tokenB.type === TokenType.ARC200 ? 2 : -1;

		const atc = new algosdk.AtomicTransactionComposer();

		const { return: poolId } = await client.createPool(
			{
				alphaId: tokenA.id,
				alphaType: aType,
				betaId: tokenB.id,
				betaType: bType,
				name: strToFixedBytes(`${tokenA.symbol}-${tokenB.symbol} LP`, 32),
				symbol: strToFixedBytes(`LPT`, 8),
				swapFee: SCALE * 0.01,
				payTxn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
					from: signer.addr,
					to: algosdk.getApplicationAddress(contracts.poolFcatory),
					amount: 2_000_000,
					suggestedParams: await nodeClient.getTransactionParams().do(),
				}),
			},
			{
				sendParams: { populateAppCallResources: true },
			}
		);
		console.log({ poolId });
		await client.poolBootstrap(
			{ poolId: Number(poolId) },
			{
				sendParams: { populateAppCallResources: true },
			}
		);
		console.log('bootstrap done');
	}
</script>

<button on:click={setFee}>set factory fee</button>
<form>
	<div>
		<input type="text" placeholder="token 1" value={tokenA?.id ?? ''} />
		<button
			class="btn btn-ghost"
			on:click={() =>
				openModal(SelectTokenModal, {
					tokens: $knownTokens,
					handleSelect(token) {
						tokenA = token;
					},
				})}
			>{tokenA?.symbol ?? 'Select'}
		</button>
	</div>
	<div>
		<input type="text" placeholder="token 2" value={tokenB?.id ?? ''} />
		<button
			class="btn btn-ghost"
			on:click={() =>
				openModal(SelectTokenModal, {
					tokens: $knownTokens,
					handleSelect(token) {
						tokenB = token;
					},
				})}
			>{tokenB?.symbol ?? 'Select'}
		</button>
	</div>

	{#if tokenA && tokenB}
		<button on:click={createPool}>Craete Pool {tokenA.symbol} / {tokenB.symbol}</button>
	{/if}
</form>

<style>
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 400px;
		margin: 0 auto;
		gap: 1rem;
	}
	input {
		background-color: transparent;
		padding: 0.25rem;
	}
</style>
