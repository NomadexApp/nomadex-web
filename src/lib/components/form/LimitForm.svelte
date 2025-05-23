<script lang="ts">
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import ActionButton from '$lib/components/form/ActionButton.svelte';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import SwapInfo from '$lib/components/form/SwapInfo.svelte';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import type { Token } from '$lib';

	export let tokenABalance: number | bigint = 0n;
	export let tokenBBalance: number | bigint = 0n;
	export let tokenA: Token;
	export let tokenB: Token;
	export let disabled = false;
	export let onInputTokenA = () => {};
	export let handleSubmit = () => {};
	export let buying = true;

	export let price = 0;
	export let tokenAInput = 0;
	export let tokenBInput = 0;
	$: tokenBInput = buying ? tokenAInput / price : tokenAInput * price;

	$: maxBalanceError = buying
		? Number(tokenAInput) > Number(tokenBBalance)
		: Number(tokenAInput) > Number(tokenABalance);

	$: isDisabled = disabled || maxBalanceError || !tokenAInput || !tokenBInput;
</script>

<div class="form">
	<FormTitle>Create order ({buying ? 'buy' : 'sell'})</FormTitle>
	<TokenInput
		pretext="Price of 1 {tokenA.symbol}"
		token={tokenA.symbol}
		bind:value={price}
		on:keydown={(e) => disabled && e.preventDefault()}
	>
		<svelte:fragment slot="currency">
			{tokenB.symbol}
		</svelte:fragment>
	</TokenInput>
	<TokenInput
		pretext="You pay"
		posttext={`balance ${(buying ? tokenBBalance : tokenABalance).toLocaleString()} ${
			(buying ? tokenB : tokenA).symbol
		}`}
		token={(buying ? tokenB : tokenA).symbol}
		showMax
		bind:value={tokenAInput}
		on:keydown={(e) => disabled && e.preventDefault()}
		handleMax={() => {
			tokenAInput = Number(buying ? tokenBBalance : tokenABalance);
			onInputTokenA();
		}}
	>
		<svelte:fragment slot="currency">
			{(buying ? tokenB : tokenA).symbol}
		</svelte:fragment>
	</TokenInput>
	<TokenInput
		pretext="You receive"
		token={(buying ? tokenB : tokenA).symbol}
		value={Number(Number(tokenBInput).toFixed(6))}
		disabled
	>
		<svelte:fragment slot="currency">
			{(buying ? tokenA : tokenB).symbol}
		</svelte:fragment>
	</TokenInput>

	<ActionButton on:click={handleSubmit} disabled={Boolean($connectedAccount) && isDisabled}>
		{#if $connectedAccount}
			Create Limit Order
		{:else}
			Connect to a Wallet
		{/if}
	</ActionButton>

	<SwapInfo data={[['Maker Fee', '0%']]} />
</div>

<style>
	.form {
		background-color: var(--primary-color);
		margin: 0 auto 0 auto;
		height: max-content;
		padding: 2rem;
		background: #00000040;
		backdrop-filter: blur(5px);
		border-radius: 8px;
		width: 500px;
		max-width: calc(100vw - 2rem);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
