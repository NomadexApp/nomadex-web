<script lang="ts">
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import ActionButton from '$lib/components/form/ActionButton.svelte';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import SwapInfo from '$lib/components/form/SwapInfo.svelte';
	import SelectTokenModal from '$lib/components/modal/SelectTokenModal.svelte';
	import { openModal } from '../modal/Modal.svelte';
	import MdSwapVert from '$lib/icons/MdSwapVert.svelte';
	import { knownPools, knownTokens, platformFee, type Pool, type Token } from '$lib';
	import { readableNumber } from '$lib/components/CurrencyNumber.svelte';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { SCALE } from '../../../contracts/pool/constants';

	export let tokenABalance: number | bigint = 0n;
	export let tokenBBalance: number | bigint = 0n;
	export let poolTokenABalance: number | bigint = 0n;
	export let poolTokenBBalance: number | bigint = 0n;
	export let minReceived = 0;
	export let tokenAInput = 0;
	export let tokenBInput = 0;
	export let slippage = 1;
	export let slippagePercent = slippage * 100;
	export let impact = 1;
	export let tokenA: Token;
	export let tokenB: Token;
	export let pool: Pool;
	export let disabled = false;
	export let onInputTokenA = () => {};
	export let onInputTokenB = () => {};
	export let handleSwitchPlaces = () => {};
	export let handleSwap = () => {};
	export let handleTokenChange: (token: Token, index: number) => void = () => {};
	export let fee = 0;

	let editingSlippage = false;

	let swapInfo: [string, string][] = [];

	$: swapInfo = pool
		? [
				[
					'Pool balance',
					`${readableNumber(Number(poolTokenABalance ?? 0)).toLocaleString()} ${tokenA.symbol} / ${readableNumber(Number(poolTokenBBalance) || 0).toLocaleString()} ${
						tokenB.symbol
					}`,
				],
				['Min received', `${(tokenAInput && tokenBInput ? minReceived : 0).toLocaleString()} ${tokenB.symbol}`],
				...(tokenAInput && tokenBInput
					? [
							['Fee', `${fee.toLocaleString()} ${tokenB.symbol}`] as [string, string],
							[
								`Price of ${tokenA.symbol}`,
								`${Number((Number(Math.floor((tokenBInput || 0) * 1e6)) / Number(Math.floor((tokenAInput || 0) * 1e6))).toFixed(4))} ${tokenB.symbol}`,
							] as [string, string],
						]
					: []),
				['Price impact', `${tokenAInput && tokenBInput ? impact : 0}%`],
				['Slippage', `${slippage * 100}%`],
			]
		: [];
</script>

<div class="form pt-8">
	<FormTitle>Swap {tokenA.symbol} for {tokenB.symbol}</FormTitle>
	<TokenInput
		pretext="You pay"
		posttext={`balance ${tokenABalance.toLocaleString()} ${tokenA.symbol}`}
		token={tokenA.symbol}
		showMax={!!pool}
		disabled={!pool}
		decimals={tokenA.decimals}
		bind:value={tokenAInput}
		on:keydown={(e) => disabled && e.preventDefault()}
		on:keyup={onInputTokenA}
		handleMax={() => {
			tokenAInput = tokenAInput === Number(tokenABalance) ? 0 : Number(tokenABalance);
			onInputTokenA();
		}}
		on:click={() => {
			openModal(SelectTokenModal, {
				tokens: $knownTokens.filter((tok) => tok.id !== tokenB.id),
				handleSelect(token) {
					handleTokenChange(token, 0);
				},
			});
		}}
	/>
	<div class="flex justify-center px-1">
		<button
			name="flip"
			type="reset"
			class="btn btn-ghost btn-link text-white btn-sm opacity-80"
			on:click={handleSwitchPlaces}
		>
			<span class="block h-6"><MdSwapVert /></span>
		</button>
	</div>
	<TokenInput
		pretext="You receive"
		token={tokenB.symbol}
		posttext={`balance ${tokenBBalance.toLocaleString()} ${tokenB.symbol}`}
		disabled={!pool}
		decimals={tokenB.decimals}
		bind:value={tokenBInput}
		on:keydown={(e) => disabled && e.preventDefault()}
		on:keyup={onInputTokenB}
		on:click={() => {
			openModal(SelectTokenModal, {
				tokens: $knownPools
					.map((p) => {
						if (p.assets[0].id === p.assets[1].id) return;
						if (p.assets[0].id === tokenA.id) {
							return p.assets[1];
						} else if (p.assets[1].id === tokenA.id) {
							return p.assets[0];
						}
					})
					.filter(Boolean),
				handleSelect(token) {
					handleTokenChange(token, 1);
				},
			});
		}}
	/>

	<div class="flex justify-end items-center gap-2 text-[#999999]">
		<div class="text-[0.8rem] text-[#f0f0f0aa]">Slippage</div>
		<div on:click={() => (editingSlippage = true)} on:keydown role="button" tabindex="0">
			<input
				type="number"
				class="no-arrows bg-[#00000020] outline-none p-[1px] px-[2px] text-[0.9rem] w-[3rem] text-center rounded"
				min={0.01}
				max={40}
				step={0.01}
				bind:value={slippagePercent}
				placeholder="1%"
				on:blur={() => {
					slippage = slippagePercent / 100;
					editingSlippage = false;
					onInputTokenA();
				}}
			/> %
		</div>
	</div>

	<ActionButton on:click={handleSwap} disabled={Boolean($connectedAccount) && disabled}>
		{#if $connectedAccount}
			{pool ? 'Swap' : 'Pool not found'}
		{:else}
			Connect to a Wallet
		{/if}
	</ActionButton>

	<SwapInfo data={swapInfo} />
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
	input:focus-within {
		color: white;
	}
</style>
