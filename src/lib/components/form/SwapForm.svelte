<script lang="ts">
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import ActionButton from '$lib/components/form/ActionButton.svelte';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import SwapInfo from '$lib/components/form/SwapInfo.svelte';
	import SelectTokenModal from '$lib/components/modal/SelectTokenModal.svelte';
	import { openModal } from '../modal/Modal.svelte';
	import MdSwapVert from 'svelte-star/dist/md/MdSwapVert.svelte';
	import type { Token } from '$lib';
	import { readableNumber } from '$lib/CurrencyNumber.svelte';

	export let tokenABalance: number | bigint = 0n;
	export let tokenBBalance: number | bigint = 0n;
	export let poolTokenABalance: number | bigint = 0n;
	export let poolTokenBBalance: number | bigint = 0n;
	export let minReceived = 0;
	export let tokenAInput = 6;
	export let tokenBInput = 6;
	export let slippage = 1;
	export let impact = 1;
	export let tokenA: Token;
	export let tokenB: Token;
	export let disabled = false;
	export let onInputTokenA = () => {};
	export let onInputTokenB = () => {};
	export let handleSwitchPlaces = () => {};
	export let handleSwap = () => {};
</script>

<form class="form">
	<FormTitle>Swap VOI for VIA</FormTitle>
	<TokenInput
		pretext="You pay"
		posttext={`balance ${tokenABalance.toLocaleString()} ${tokenA.ticker}`}
		token={tokenA.ticker}
		showMax
		bind:value={tokenAInput}
		on:keydown={(e) => disabled && e.preventDefault()}
		on:keyup={onInputTokenA}
		handleMax={() => {
			tokenAInput = Number(tokenABalance);
		}}
		on:click={() => {
			openModal(SelectTokenModal, {});
		}}
	/>
	<div class="flex justify-center px-1">
		<button
			type="reset"
			class="btn btn-ghost btn-link btn-sm opacity-80 text-base-content"
			on:click={handleSwitchPlaces}
		>
			<span class="block h-6"><MdSwapVert /></span>
		</button>
	</div>
	<TokenInput
		pretext="You receive"
		token={tokenB.ticker}
		posttext={`balance ${tokenBBalance.toLocaleString()} ${tokenB.ticker}`}
		bind:value={tokenBInput}
		on:keydown={(e) => disabled && e.preventDefault()}
		on:keyup={onInputTokenB}
		on:click={() => {
			openModal(SelectTokenModal, {});
		}}
	/>

	<ActionButton on:click={handleSwap}>Swap</ActionButton>

	<SwapInfo
		data={[
			[
				'Pool balance',
				`${readableNumber(Number(poolTokenABalance)).toLocaleString()} ${tokenA.ticker} / ${readableNumber(
					Number(poolTokenBBalance)
				).toLocaleString()} ${tokenB.ticker}`,
			],
			['Min received', `${minReceived.toLocaleString()} ${tokenB.ticker}`],
			['Price impact', `${impact}%`],
			['Slippage', `${slippage * 100}%`],
			['Fee', '1%'],
		]}
	/>
</form>

<style>
	form {
		background-color: var(--primary-color);
		margin: 100px auto 0 auto;
		height: max-content;
		padding: 2rem;
		background: #222211;
		border-radius: 8px;
		width: 500px;
		max-width: calc(100vw - 2rem);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: 10px;
	}
</style>
