<script lang="ts">
	import { contracts, knownPools, knownTokens, tokensAndPoolsRefresh, TokenType, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { openModal } from '$lib/components/modal/Modal.svelte';
	import SelectTokenModal from '$lib/components/modal/SelectTokenModal.svelte';
	import { connectedAccount, getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import { PoolFactoryClient } from '../../../contracts/clients/PoolFactoryClient';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import ActionButton from '$lib/components/form/ActionButton.svelte';
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import { goto } from '$app/navigation';
	import { addNotification } from '$lib/components/Notify.svelte';

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
				id: contracts[PUBLIC_NETWORK].poolFcatory,
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

	async function createPool(tokenA: Token, tokenB: Token) {
		if (!tokenA || !tokenB) throw Error('must select assets');

		const remove = addNotification('pending', `Creating pool ${tokenA.symbol}/${tokenB.symbol}`);
		const signer = getTransactionSignerAccount();
		const client = new PoolFactoryClient(
			{
				id: contracts[PUBLIC_NETWORK].poolFcatory,
				resolveBy: 'id',
				sender: signer,
			},
			nodeClient
		);
		const aType = tokenA.type === TokenType.ALGO ? 0 : tokenA.type === TokenType.ASA ? 1 : tokenA.type === TokenType.SMART ? 2 : -1;

		const bType = tokenB.type === TokenType.ALGO ? 0 : tokenB.type === TokenType.ASA ? 1 : tokenB.type === TokenType.SMART ? 2 : -1;

		const atc = new algosdk.AtomicTransactionComposer();

		try {
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
						to: algosdk.getApplicationAddress(contracts[PUBLIC_NETWORK].poolFcatory),
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
			remove();
			addNotification('pending', 'Redirecting to the pool page...', 15000);
			await new Promise((r) => setTimeout(r, 12000));
			window.location.href = `/liquidity/${poolId}/add`;
		} catch (e) {
			remove();
			addNotification('error', (e as Error).message, 15000);
		}
	}

	$: matchedPool =
		tokenA.id !== tokenB.id
			? $knownPools.find((pool) => {
					const a = pool.assets[0].id === tokenA.id && pool.assets[1].id === tokenB.id;
					const b = pool.assets[1].id === tokenA.id && pool.assets[0].id === tokenB.id;
					return a || b;
			  })
			: undefined;
</script>

<div class="form pt-8">
	<FormTitle>Create a Pool</FormTitle>
	<TokenInput
		pretext="Asset ID"
		token={tokenA.symbol}
		posttext={``}
		disabled={true}
		decimals={tokenA.decimals}
		value={tokenA.id}
		on:click={() => {
			openModal(SelectTokenModal, {
				tokens: $knownTokens.filter((t) => t.id !== tokenB.id),
				handleSelect(token) {
					tokenA = token;
				},
			});
		}}
	/>
	<TokenInput
		pretext="Asset ID"
		token={tokenB.symbol}
		posttext={``}
		disabled={true}
		decimals={tokenB.decimals}
		value={tokenB.id}
		on:click={() => {
			openModal(SelectTokenModal, {
				tokens: $knownTokens.filter((t) => t.id !== tokenA.id),
				handleSelect(token) {
					tokenB = token;
				},
			});
		}}
	/>
	<ActionButton
		on:click={() => {
			if (tokenA.id === tokenB.id) return;
			if (matchedPool) {
				goto(`/liquidity/${matchedPool.id}/add`);
			} else {
				const [a, b] = [tokenA, tokenB].sort((a, b) => a.type - b.type);
				createPool(a, b);
			}
		}}
		disabled={!$connectedAccount || tokenA.id === tokenB.id || !!matchedPool}
	>
		{#if $connectedAccount && !matchedPool}
			{#if tokenA.id === tokenB.id}
				Invalid
			{:else}
				Create {[tokenA, tokenB]
					.sort((a, b) => a.type - b.type)
					.map((a) => a.symbol)
					.join('/')} Pool
			{/if}
		{:else if matchedPool}
			Pool {matchedPool.assets[0].symbol}/{matchedPool.assets[1].symbol} exists
		{:else}
			Connect to a Wallet
		{/if}
	</ActionButton>
</div>

<style>
	.form {
		margin: 5rem auto 0 auto;
		height: max-content;
		padding: 2rem;
		backdrop-filter: blur(5px);
		background: #00000040;
		border-radius: 8px;
		width: 500px;
		max-width: calc(100vw - 2rem);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
