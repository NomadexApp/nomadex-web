<script lang="ts">
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import ActionButton from '$lib/components/form/ActionButton.svelte';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import SwapInfo from '$lib/components/form/SwapInfo.svelte';
	import { type Pool, type Token } from '$lib';
	import { readableNumber } from '$lib/components/CurrencyNumber.svelte';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';

	export let tokenLptBalance: number | bigint = 0n;
	export let tokenABalance: number | bigint = 0n;
	export let tokenBBalance: number | bigint = 0n;
	export let poolTokenABalance: number | bigint = 0n;
	export let poolTokenBBalance: number | bigint = 0n;
	export let poolShare = 0;
	export let tokenLptInput = 0;
	export let tokenAInput = 0;
	export let tokenBInput = 0;
	export let pool: Pool;
	export let tokenA: Token;
	export let tokenB: Token;
	export let disabled = false;
	export let action: string;
	export let onInputTokenLpt = () => {};
	export let onInputTokenA = () => {};
	export let onInputTokenB = () => {};
	export let handleSubmit = () => {};
</script>

<div class="form">
	<FormTitle>{action === 'remove' ? 'Remove' : 'Add'} Liquidity</FormTitle>
	{#if action === 'remove'}
		<TokenInput
			pretext="You pay"
			posttext={`balance ${tokenLptBalance.toLocaleString()} LPT`}
			token={'LPT'}
			showMax
			bind:value={tokenLptInput}
			on:keydown={(e) => disabled && e.preventDefault()}
			on:keyup={onInputTokenLpt}
			handleMax={() => {
				tokenLptInput = tokenLptInput === Number(tokenLptBalance) ? 0 : Number(tokenLptBalance);
				onInputTokenLpt();
			}}
		>
			<svelte:fragment slot="currency">LPT</svelte:fragment>
		</TokenInput>
	{/if}
	<TokenInput
		pretext={action === 'remove' ? '' : 'You pay'}
		posttext={action === 'add' ? `balance ${tokenABalance.toLocaleString()} ${tokenA.symbol}` : ''}
		token={tokenA.symbol}
		showMax={action === 'add'}
		decimals={tokenA.decimals}
		bind:value={tokenAInput}
		on:keydown={(e) => disabled && e.preventDefault()}
		on:keyup={onInputTokenA}
		disabled={action === 'remove'}
		handleMax={() => {
			tokenAInput = tokenAInput === Number(tokenABalance) ? 0 : Number(tokenABalance);
			onInputTokenA();
		}}
	>
		<svelte:fragment slot="currency">{tokenA.symbol}</svelte:fragment>
	</TokenInput>
	<TokenInput
		pretext={action === 'remove' ? '' : 'You pay'}
		token={tokenB.symbol}
		posttext={action === 'add' ? `balance ${tokenBBalance.toLocaleString()} ${tokenB.symbol}` : ''}
		decimals={tokenB.decimals}
		bind:value={tokenBInput}
		on:keydown={(e) => disabled && e.preventDefault()}
		on:keyup={onInputTokenB}
		disabled={action === 'remove'}
		showMax={action === 'add'}
		handleMax={() => {
			tokenBInput = tokenBInput === Number(tokenBBalance) ? 0 : Number(tokenBBalance);
			onInputTokenB();
		}}
	>
		<svelte:fragment slot="currency">{tokenB.symbol}</svelte:fragment>
	</TokenInput>

	<ActionButton on:click={handleSubmit} disabled={Boolean($connectedAccount) && disabled}>
		{#if $connectedAccount}
			{action === 'remove' ? 'Remove' : 'Add'} Liquidity
		{:else}
			Connect to a Wallet
		{/if}
	</ActionButton>

	<SwapInfo
		data={[
			[
				'Pool balance',
				`${readableNumber(Number(poolTokenABalance ?? 0)).toLocaleString()} ${tokenA.symbol} / ${readableNumber(Number(poolTokenBBalance) || 0).toLocaleString()} ${tokenB.symbol}`,
			],
			['Your share', `${(poolShare || 0).toLocaleString()}%`],
		]}
	/>
</div>

<div class="br"></div>
<div class="flex justify-center text-sm">
	<a class="hover:underline underline-offset-4 text-[#ffffff]" href="/liquidity/{pool.id}/{action === 'remove' ? 'add' : 'remove'}" on:click={() => pageContentRefresh()}>
		{action === 'remove' ? 'Add' : 'Remove'} Liquidity
	</a>
</div>

<style>
	.form {
		background-color: var(--primary-color);
		margin: 5rem auto 0 auto;
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
