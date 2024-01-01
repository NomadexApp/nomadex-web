<script lang="ts">
	import { type Token, knownTokens } from '$lib';
	import Dropdown from '$lib/Dropdown.svelte';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { viaAppId } from '$lib/_shared';
	import { currentAppId } from '$lib/_deployed';
	import { calculateInTokens, calculateOutTokens } from '$lib/howMuch';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';
	import { onNumberKeyPress } from '$lib/inputs';
	import MdSwapVert from 'svelte-star/dist/md/MdSwapVert.svelte';
	import ContractMethods from '$lib/contractMethods';
	import { onChainStateWatcher } from '$lib/stores/onchain';
	import algosdk from 'algosdk';

	const { page } = getStores();
	const tokenA = <Token>knownTokens.find((token) => token.ticker === $page.params.tokenA);
	const tokenB = <Token>knownTokens.find((token) => token.ticker === $page.params.tokenB);
	const slippage = 0.01;

	const connectedUserState = onChainStateWatcher.getAccountWatcher($connectedAccount);
	const currentPoolState = onChainStateWatcher.getAccountWatcher(algosdk.getApplicationAddress(currentAppId));

	let tokens: [Token, Token] | undefined = undefined;

	$: loaded = $currentPoolState.arc200Balances[tokenA.ticker === 'VOI' ? tokenB.id : tokenA.id];

	onMount(() => {
		if (!tokenA || !tokenB) {
			goto(`/swap/${knownTokens[0].ticker}-${knownTokens[1].ticker}`, { replaceState: true });
			return;
		}
		tokens = [tokenA, tokenB];
	});

	function setSelectedToken(token: Token, index: number) {
		if (!tokens) return;
		const lastSelected = tokens[index];
		if (lastSelected.ticker !== token.ticker) {
			updateRoute(token, tokens[index]);
		}
	}

	function updateRoute(tokenA: Token, tokenB: Token) {
		if (!tokens) return;
		if (tokens[0].ticker !== tokenA.ticker || tokens[1].ticker !== tokenB.ticker) {
			goto(`/swap/${tokenA.ticker}-${tokenB.ticker}`, { replaceState: true });
			pageContentRefresh(0);
		}
	}

	$: browser && tokens && tokens[0] && tokens[1] && updateRoute(tokens[0], tokens[1]);

	let inputTokenA: number = 0;
	let inputTokenB: number = 0;
	let disabled = true;
	let loading = false;

	let timeout: NodeJS.Timeout;

	async function onInputTokenA() {
		if (!tokenA || !tokenB) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenB = 0;
		if (!inputTokenA || typeof inputTokenA !== 'number') return;
		let tm: NodeJS.Timeout | undefined;
		await new Promise((r) => {
			timeout = setTimeout(r, 500);
			tm = timeout;
		});
		loading = true;
		const ret = calculateOutTokens(
			Math.floor(inputTokenA * 1e6),
			tokenA.ticker === 'VOI' ? $currentPoolState.amount : $currentPoolState.arc200Balances[viaAppId],
			tokenA.ticker === 'VOI' ? $currentPoolState.arc200Balances[viaAppId] : $currentPoolState.amount,
			100
		);
		loading = false;
		if (tm && tm === timeout) {
			inputTokenB = Number(ret) / 1e6;
			disabled = !inputTokenB;
		}
	}

	async function onInputTokenB() {
		if (!tokenA || !tokenB) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		if (!inputTokenB || typeof inputTokenB !== 'number') return;
		let tm: NodeJS.Timeout | undefined;
		await new Promise((r) => {
			timeout = setTimeout(r, 500);
			tm = timeout;
		});
		loading = true;
		const ret = calculateInTokens(
			Math.floor(inputTokenB * 1e6),
			tokenA.ticker === 'VOI' ? $currentPoolState.amount : $currentPoolState.arc200Balances[viaAppId],
			tokenA.ticker === 'VOI' ? $currentPoolState.arc200Balances[viaAppId] : $currentPoolState.amount,
			100
		);
		loading = false;
		if (tm && tm === timeout) {
			inputTokenA = (Number(ret) + Number(ret) * 0.0001) / 1e6;
			disabled = !inputTokenB;
		}
	}

	async function swap() {
		if (!tokenA || !tokenB) return;
		const prev = disabled;
		disabled = true;

		const tokenAAmount = Math.floor(inputTokenA * 1e6);
		const tokenBAmount = Math.floor(inputTokenB * 1e6);
		const minOfTokenB = Math.floor(tokenBAmount - Math.round(tokenBAmount * slippage));

		if (tokenA.ticker === 'VOI' && tokenB.ticker === 'VIA') {
			await ContractMethods.call('swapVoiToVia', tokenAAmount, minOfTokenB);
			pageContentRefresh(0);
		} else if (tokenA.ticker === 'VIA' && tokenB.ticker === 'VOI') {
			await ContractMethods.call('swapViaToVoi', tokenAAmount, minOfTokenB);
			pageContentRefresh(0);
		}
		disabled = prev;
	}
</script>

{#if tokenA && tokenB && tokens}
	<div class="w-full h-full flex flex-col items-center p-12">
		<form on:submit|preventDefault class="flex flex-col gap-2 w-full max-w-[448px] mt-40 prose">
			<h4 class="text-left">Swap {tokens[0].ticker} for {tokens[1].ticker}</h4>
			<label for="">
				{tokens[0].ticker}
			</label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokens[0].ticker} amount"
					bind:value={inputTokenA}
					step={1 / 1e6}
					on:keydown={(e) => !loaded && e.preventDefault()}
					on:keypress={onNumberKeyPress}
					on:keyup={onInputTokenA}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				{#await tokens[0].ticker === 'VIA' ? $connectedUserState.arc200Balances[viaAppId] : $connectedUserState.amount then balance}
					<span
						class="absolute right-0 bottom-full cursor-pointer"
						on:click={() => {
							inputTokenA = balance / 1e6;
							onInputTokenA();
						}}
						on:keydown={null}>MAX {(balance / 1e6).toLocaleString('en')}</span
					>
				{/await}
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
					selected={{ name: tokens[0].ticker, value: tokens[0] }}
					onSelect={(value) => setSelectedToken(value, 0)}
				/>
			</div>
			<div class="flex justify-center px-1">
				<button
					type="reset"
					class="btn btn-ghost btn-link btn-sm opacity-30 text-base-content"
					on:click={() => {
						if (!tokens) return;
						updateRoute(tokens[1], tokens[0]);
					}}
				>
					<span class="block h-6"><MdSwapVert /></span>
				</button>
			</div>
			<label for="">{tokens[1].ticker}</label>
			<div class="flex items-center relative">
				<input
					type="number"
					placeholder="{tokens[1].ticker} amount"
					bind:value={inputTokenB}
					step={1 / 1e6}
					on:keydown={(e) => !loaded && e.preventDefault()}
					on:keypress={onNumberKeyPress}
					on:keyup={onInputTokenB}
					required
					class="input input-primary border-r-0 rounded-r-none input-bordered w-full focus:outline-none"
				/>
				{#await tokens[1].ticker === 'VIA' ? $connectedUserState.arc200Balances[viaAppId] : $connectedUserState.amount then balance}
					<span class="absolute right-0 bottom-full cursor-pointer">{(balance / 1e6).toLocaleString('en')}</span>
				{/await}
				<Dropdown
					class="btn-ghost border-primary hover:border-primary border-l-0 rounded-l-none m-0 mx-0"
					options={knownTokens.map((token) => ({ name: token.ticker, value: token }))}
					selected={{ name: tokens[1].ticker, value: tokens[1] }}
					onSelect={(value) => setSelectedToken(value, 1)}
				/>
			</div>

			<div class="flex flex-col gap-0">
				<span class="flex justify-between items-center">
					Min Received = {(inputTokenB - inputTokenB * slippage).toLocaleString('en')}
					{tokens[1].ticker}
					{#if loading}<span class="loading h-4 w-4" />{/if}
				</span>

				<span class="flex justify-between">
					{#if $currentPoolState.arc200Balances[viaAppId]}
						Liquidity =
						{($currentPoolState.amount / 1e6).toLocaleString('en')} VOI /
						{($currentPoolState.arc200Balances[viaAppId] / 1e6).toLocaleString('en')} VIA
					{:else}
						Liquidity = 0 VOI / 0 VIA
						<span class="loading w-[1rem]" />
					{/if}
				</span>
			</div>

			<div class="flex justify-center mt-2 pr-0">
				<button
					class="btn btn-primary w-full box-border"
					class:disabled={tokens[0].ticker === tokens[1].ticker || disabled}
					{disabled}
					on:click={swap}
				>
					Swap
				</button>
			</div>
		</form>
	</div>
{/if}

<style lang="postcss">
	.disabled {
		@apply btn-outline;
		pointer-events: none;
	}
	form {
		opacity: 0;
		animation: fadein 1s forwards;
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
