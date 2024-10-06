<script lang="ts">
	import { type Token, type Pool, platformFee } from '$lib';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { pageContentRefresh } from '$lib/utils';
	import { calculateInTokens, calculateOutTokens } from '$lib/utils/howMuch';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import SwapForm from '$lib/components/form/SwapForm.svelte';
	import { openModal } from '$lib/components/modal/Modal.svelte';
	import ConnectWallet from '$lib/components/modal/ConnectWallet.svelte';
	import type { SwapAlphaBetaOpts } from './Swap.svelte';
	import { convertDecimals } from '$lib/utils/numbers';

	export let tokenA: Token;
	export let tokenB: Token;
	export let alphaToken: Token;
	export let betaToken: Token;
	export let pool: Pool;
	betaToken;

	export let userTokenABalanceInRange = 0;
	export let userTokenBBalanceInRange = 0;
	export let poolTokenABalanceInRange = 0;
	export let poolTokenBBalanceInRange = 0;

	export let poolTokenABalance = 0n;
	export let poolTokenBBalance = 0n;
	export let handleSwap: (opt: SwapAlphaBetaOpts) => Promise<bigint | undefined>;
	export let updateBalances: Function;

	let tokens: [Token, Token] | undefined = [tokenA, tokenB];

	let slippage = browser ? JSON.parse(localStorage.getItem('slippage') ?? '0.025') : 0.025;

	let fee = 0;

	$: browser && localStorage.setItem('slippage', JSON.stringify(slippage));

	function setSelectedToken(token: Token, index: number) {
		if (index === 0) {
			if (tokenA.symbol !== token.symbol) {
				updateRoute(token, tokenB);
			}
		} else {
			if (tokenB.symbol !== token.symbol) {
				updateRoute(tokenA, token);
			}
		}
	}

	function updateRoute(aToken: Token, bToken: Token) {
		if (aToken.id !== tokenA.id || bToken.id !== tokenB.id) {
			goto(`/${aToken.type}/${aToken.id}/${bToken.type}/${bToken.id}`, { replaceState: true });
			pageContentRefresh(0);
		}
	}

	$: browser && tokens && tokenA && tokenB && updateRoute(tokenA, tokenB);

	let inputTokenA: number = 0;
	let inputTokenB: number = 0;
	let disabled = true;
	let loading = false;

	let timeout: NodeJS.Timeout;

	async function onInputTokenA() {
		if (!tokenA || !tokenB || !pool) return;
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
		const retWithoutFee = calculateOutTokens(
			BigInt(Math.floor(inputTokenA * tokenA.unit)),
			poolTokenABalance, //
			poolTokenBBalance, //
			0n
		);
		const ret = calculateOutTokens(
			BigInt(Math.floor(inputTokenA * tokenA.unit)),
			poolTokenABalance, //
			poolTokenBBalance, //
			BigInt(pool.swapFee) + $platformFee
		);
		loading = false;
		if (tm && tm === timeout) {
			inputTokenB = Number((Number(ret) / tokenB.unit).toFixed(tokenB.decimals));
			fee = Number(convertDecimals(retWithoutFee - ret, tokenB.decimals, 6)) / 1e6;
			disabled = !inputTokenB;
		}
	}

	async function onInputTokenB() {
		if (!tokenA || !tokenB || !pool) return;
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
		const outAmount = BigInt(Math.floor(inputTokenB * tokenB.unit));
		let ret = calculateInTokens(outAmount, poolTokenABalance, poolTokenBBalance, BigInt(pool.swapFee) + $platformFee);
		let outToken = calculateOutTokens(ret, poolTokenABalance, poolTokenBBalance, BigInt(pool.swapFee) + $platformFee);
		if (ret > 0n && outToken < outAmount) {
			ret += 1n;
		}
		const outTokenWithoutFee = calculateOutTokens(ret, poolTokenABalance, poolTokenBBalance, 0n);
		outToken = calculateOutTokens(ret, poolTokenABalance, poolTokenBBalance, BigInt(pool.swapFee) + $platformFee);

		loading = false;
		if (tm && tm === timeout) {
			inputTokenA = Number((Math.ceil(Number(ret)) / tokenA.unit).toFixed(tokenA.decimals));
			fee = Number(convertDecimals(outTokenWithoutFee - outToken, tokenB.decimals, 6)) / 1e6;
			disabled = !inputTokenB;
		}
	}

	async function swap() {
		if (!tokenA || !tokenB || !pool) return;
		const prev = disabled;
		disabled = true;
		const tokenAAmount = Math.floor(inputTokenA * tokenA.unit);
		const tokenBAmount = Math.floor(inputTokenB * tokenB.unit);
		const minOfTokenB = Math.floor(tokenBAmount - Math.round(tokenBAmount * slippage));

		try {
			const got = await handleSwap({
				pool,
				tokenA,
				tokenB,
				inputTokenA,
				minOfTokenB,
				isDirectionAlphaToBeta: alphaToken.id === tokenA.id,
			});
			console.log('Swap:', got);
			updateBalances();
		} catch (e) {
			console.error((<Error>e).message);
		}
		pageContentRefresh(0);
		disabled = prev;
	}

	let impact = 0;

	// $: impact = Number((((poolTokenABalance * 0.99 + inputTokenA) / (poolTokenBBalance - inputTokenB) / ((poolTokenABalance * 0.99) / poolTokenBBalance) - 1) * 100 || 0).toFixed(2));

	let lastPoolArc200Balance = 0n;
	let lastPoolAlgoBalance = 0;

	// function change() {
	// 	if (inputTokenA) {
	// 		onInputTokenA();
	// 		lastPoolArc200Balance = $poolArc200Balance;
	// 		lastPoolAlgoBalance = $currentPoolState.amount;
	// 	}
	// }
	// $: if ($poolArc200Balance && $currentPoolState.amount && ($poolArc200Balance !== lastPoolArc200Balance || $currentPoolState.amount !== lastPoolAlgoBalance)) {
	// 	change();
	// }

	$: maxError = inputTokenA > userTokenABalanceInRange;
</script>

{#if tokenA && tokenB}
	<SwapForm
		disabled={!inputTokenB || !inputTokenA || !pool || maxError}
		tokenABalance={userTokenABalanceInRange}
		tokenBBalance={userTokenBBalanceInRange}
		poolTokenABalance={poolTokenABalanceInRange}
		poolTokenBBalance={poolTokenBBalanceInRange}
		minReceived={inputTokenB - inputTokenB * slippage}
		{impact}
		bind:tokenAInput={inputTokenA}
		bind:tokenBInput={inputTokenB}
		bind:slippage
		{tokenA}
		{tokenB}
		{pool}
		{onInputTokenA}
		{onInputTokenB}
		{fee}
		handleSwitchPlaces={() => {
			if (!tokens) return;
			updateRoute(tokenB, tokenA);
		}}
		handleSwap={() => ($connectedAccount ? (disabled ? null : swap()) : openModal(ConnectWallet, {}))}
		handleTokenChange={(token, index) => setSelectedToken(token, index)}
	/>
{:else}
	<h3>Token Not Found</h3>
{/if}

<style>
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
