<script lang="ts">
	import { type Token, knownTokens, TokenType, knownPools, type Pool } from '$lib';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { calculateInTokens, calculateOutTokens } from '$lib/howMuch';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';
	import { onChainStateWatcher, watchArc200Balance } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { PoolConnector } from '$lib/PoolConnector';
	import { convertDecimals } from '$lib/numbers';
	import SwapForm from '$lib/components/form/SwapForm.svelte';
	import { openModal } from '$lib/components/modal/Modal.svelte';
	import ConnectWallet from '$lib/components/modal/ConnectWallet.svelte';

	const { page } = getStores();

	const tokenA = <Token>$knownTokens.find((token) => token.id === Number($page.params.aId));
	const tokenB = <Token>$knownTokens.find((token) => token.id === Number($page.params.bId));

	let matchedPool: Pool = <any>undefined;

	let alphaToken: Token;
	let betaToken: Token;

	if (tokenA && tokenB) {
		const match = $knownPools.find((pool) => {
			const assetIds = [pool.assets[0].id, pool.assets[1].id];
			return assetIds.includes(tokenA.id) && assetIds.includes(tokenB.id) && tokenA.id !== tokenB.id;
		});
		if (match) matchedPool = match;
	}

	if (!matchedPool || !tokenA || !tokenB) {
		throw Error('pool not found');
	} else {
		[alphaToken, betaToken] = matchedPool.assets;
	}

	// if (fromToken.symbol && toToken.symbol) {
	// 	lastActiveSwapPair.set(`${fromToken.symbol}-${toToken.symbol}`);
	// }

	let tokens: [Token, Token] | undefined = [tokenA, tokenB];

	let slippage = browser ? JSON.parse(localStorage.getItem('slippage') ?? '0.025') : 0.025;

	$: browser && localStorage.setItem('slippage', JSON.stringify(slippage));

	const connectedUserState = onChainStateWatcher.getAccountWatcher($connectedAccount);
	const currentPoolState = onChainStateWatcher.getAccountWatcher(algosdk.getApplicationAddress(matchedPool.poolId));

	const userArc200Balance = watchArc200Balance(betaToken.id, $connectedAccount);
	const poolArc200Balance = watchArc200Balance(betaToken.id, algosdk.getApplicationAddress(matchedPool.poolId));

	$: loaded = $poolArc200Balance && $currentPoolState.amount;

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
		const poolVoiBalance = BigInt($currentPoolState.amount) - BigInt($currentPoolState['min-balance'] ?? 0n);
		const poolViaBalance = $poolArc200Balance ?? 0n;
		const ret = calculateOutTokens(
			BigInt(Math.floor(inputTokenA * tokenA.unit)),
			tokenA.symbol === 'VOI' ? poolVoiBalance : poolViaBalance,
			tokenA.symbol === 'VOI' ? poolViaBalance : poolVoiBalance,
			BigInt(matchedPool.swapFee)
		);
		loading = false;
		if (tm && tm === timeout) {
			inputTokenB = Number((Number(ret) / tokenB.unit).toFixed(tokenB.decimals));
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
		const poolVoiBalance = BigInt($currentPoolState.amount) - BigInt($currentPoolState['min-balance'] ?? 0n);
		const poolViaBalance = $poolArc200Balance ?? 0n;
		const outAmount = BigInt(Math.floor(inputTokenB * tokenB.unit));
		let ret = calculateInTokens(
			outAmount,
			tokenA.symbol === 'VOI' ? poolVoiBalance : poolViaBalance,
			tokenA.symbol === 'VOI' ? poolViaBalance : poolVoiBalance,
			BigInt(matchedPool.swapFee)
		);
		const outToken = calculateOutTokens(
			ret,
			tokenA.symbol === 'VOI' ? poolVoiBalance : poolViaBalance,
			tokenA.symbol === 'VOI' ? poolViaBalance : poolVoiBalance,
			BigInt(matchedPool.swapFee)
		);
		if (ret > 0n && outToken < outAmount) {
			ret += 1n;
		}
		loading = false;
		if (tm && tm === timeout) {
			inputTokenA = Number((Math.ceil(Number(ret)) / tokenA.unit).toFixed(tokenA.decimals));
			disabled = !inputTokenB;
		}
	}

	async function swap() {
		// if (!fromToken || !toToken) return;
		// const prev = disabled;
		// disabled = true;

		// const tokenAAmount = Math.floor(inputTokenA * fromToken.unit);
		// const tokenBAmount = Math.floor(inputTokenB * toToken.unit);
		// const minOfTokenB = Math.floor(tokenBAmount - Math.round(tokenBAmount * slippage));

		// const algoArc200PoolConnector = new PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);

		// const swapActionData = {
		// 	address: $connectedAccount,
		// 	pool_id: matchedPool.poolId,
		// 	arc200_id: matchedPool.arc200Asset.assetId,
		// 	arc200_symbol: matchedPool.arc200Asset.symbol,
		// };

		// if (fromToken.symbol === alphaToken.symbol && toToken.symbol === betaToken.symbol) {
		// 	await algoArc200PoolConnector.invoke('swapVoiToArc200', BigInt(tokenAAmount), BigInt(minOfTokenB));
		// 	pageContentRefresh(0);
		// } else if (fromToken.symbol === betaToken.symbol && toToken.symbol === alphaToken.symbol) {
		// 	await algoArc200PoolConnector.invoke('swapArc200ToVoi', BigInt(tokenAAmount), BigInt(minOfTokenB));
		// 	pageContentRefresh(0);
		// }
		// disabled = prev;
	}

	$: poolTokenABalance = ($currentPoolState.amount - ($currentPoolState['min-balance'] ?? 0)) / alphaToken.unit;
	$: poolTokenBBalance = Number($poolArc200Balance) / tokenB.unit;

	$: formData = {
		tokenABalance:
			tokenA.symbol === betaToken.symbol ? $userArc200Balance : BigInt(Math.max(0, $connectedUserState.amount - (($connectedUserState['min-balance'] ?? 0) + 100_000))),
		tokenBBalance:
			tokenB.symbol === betaToken.symbol ? $userArc200Balance : BigInt(Math.max(0, $connectedUserState.amount - (($connectedUserState['min-balance'] ?? 0) + 100_000))),
	};

	let impact = 0;

	$: impact = Number((((poolTokenABalance * 0.99 + inputTokenA) / (poolTokenBBalance - inputTokenB) / ((poolTokenABalance * 0.99) / poolTokenBBalance) - 1) * 100 || 0).toFixed(2));

	let lastPoolArc200Balance = 0n;
	let lastPoolAlgoBalance = 0;

	function change() {
		if (inputTokenA) {
			onInputTokenA();
			lastPoolArc200Balance = $poolArc200Balance;
			lastPoolAlgoBalance = $currentPoolState.amount;
		}
	}
	$: if ($poolArc200Balance && $currentPoolState.amount && ($poolArc200Balance !== lastPoolArc200Balance || $currentPoolState.amount !== lastPoolAlgoBalance)) {
		change();
	}
</script>

{#if alphaToken && betaToken}
	<SwapForm
		disabled={!loaded || !inputTokenB || !inputTokenA}
		tokenABalance={Number(convertDecimals(formData.tokenABalance ?? 0n, tokenA.decimals, 6)) / 1e6}
		tokenBBalance={Number(convertDecimals(formData.tokenBBalance ?? 0n, tokenB.decimals, 6)) / 1e6}
		{poolTokenABalance}
		{poolTokenBBalance}
		minReceived={inputTokenB - inputTokenB * slippage}
		{impact}
		bind:tokenAInput={inputTokenA}
		bind:tokenBInput={inputTokenB}
		bind:slippage
		tokenA={tokenA}
		tokenB={tokenB}
		{onInputTokenA}
		{onInputTokenB}
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
