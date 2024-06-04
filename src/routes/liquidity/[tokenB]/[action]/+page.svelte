<script lang="ts">
	import { type Token, knownTokens, TokenType, knownPools, type Pool, saveVoiActionToList } from '$lib';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';
	import { onChainStateWatcher, watchArc200Balance, watchPoolTotalSupply } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { AlgoArc200PoolConnector } from '$lib/AlgoArc200PoolConnector';
	import { convertDecimals } from '$lib/numbers';
	import LiquidityForm from '$lib/components/form/LiquidityForm.svelte';
	import { openModal } from '$lib/components/modal/Modal.svelte';
	import ConnectWallet from '$lib/components/modal/ConnectWallet.svelte';

	const { page } = getStores();
	const tokenA = <Token>$knownTokens.find((token) => token.ticker === 'VOI');
	const tokenB = <Token>$knownTokens.find((token) => token.ticker === $page.params.tokenB);

	let action = $page.params.action;
	let voiToken: Token = <any>undefined;
	let arc200Token: Token = <any>undefined;
	let matchedPool: Pool = <any>undefined;

	if (tokenA?.ticker === 'VOI' && tokenB?.type === TokenType.ARC200) {
		voiToken = tokenA;
		arc200Token = tokenB;
	} else if (tokenB?.ticker === 'VOI' && tokenA?.type === TokenType.ARC200) {
		voiToken = tokenB;
		arc200Token = tokenA;
	} else if (browser) {
		goto(`/`);
	}

	if (voiToken && arc200Token) {
		const match = $knownPools.find((pool) => pool.arc200Asset.assetId === arc200Token.id);
		if (match) matchedPool = match;
	}

	if (!matchedPool) {
		throw Error('pool not found');
	}

	const connectedUserState = onChainStateWatcher.getAccountWatcher($connectedAccount);
	const currentPoolState = onChainStateWatcher.getAccountWatcher(algosdk.getApplicationAddress(matchedPool.poolId));

	const userLptBalance = watchArc200Balance(matchedPool.poolId, $connectedAccount);
	const poolIssuedTokens = watchPoolTotalSupply(matchedPool.poolId);
	const poolArc200Balance = watchArc200Balance(arc200Token.id, algosdk.getApplicationAddress(matchedPool.poolId));
	const userArc200Balance = watchArc200Balance(arc200Token.id, $connectedAccount);

	let tokens: [Token, Token] | undefined = [tokenA, tokenB];

	$: loaded = $poolArc200Balance && $currentPoolState.amount;

	function setSelectedToken(token: Token, index: number) {
		if (index === 0) {
			if (tokenA.ticker !== token.ticker) {
				updateRoute(token, tokenB);
			}
		} else {
			if (tokenB.ticker !== token.ticker) {
				updateRoute(tokenA, token);
			}
		}
	}

	function updateRoute(aToken: Token, bToken: Token) {
		if (aToken.ticker !== tokenA.ticker || bToken.ticker !== tokenB.ticker) {
			goto(`/liquidity/${bToken.ticker}`, { replaceState: true });
			pageContentRefresh(0);
		}
	}

	$: browser && tokens && tokenA && tokenB && updateRoute(tokenA, tokenB);

	$: poolTokenABalance = ($currentPoolState.amount - ($currentPoolState['min-balance'] ?? 0)) / voiToken.unit;
	$: poolTokenBBalance = Number($poolArc200Balance) / matchedPool.arc200Asset.unit;

	$: formData = {
		tokenABalance:
			tokenA.ticker === arc200Token.ticker
				? $userArc200Balance
				: BigInt(Math.max(0, $connectedUserState.amount - (($connectedUserState['min-balance'] ?? 0) + 100_000))),
		tokenBBalance:
			tokenB.ticker === arc200Token.ticker
				? $userArc200Balance
				: BigInt(Math.max(0, $connectedUserState.amount - (($connectedUserState['min-balance'] ?? 0) + 100_000))),
	};

	if (tokenA?.ticker === 'VOI' && tokenB?.type === TokenType.ARC200) {
		voiToken = tokenA;
		arc200Token = tokenB;
	} else if (browser) {
		goto(`/`);
	}

	if (voiToken && arc200Token) {
		const match = $knownPools.find((pool) => pool.arc200Asset.assetId === arc200Token.id);
		if (match) matchedPool = match;
	}

	if (!matchedPool) {
		throw Error('pool not found');
	}

	let inputTokenLpt: number = 0;
	let inputTokenA: number = 0;
	let inputTokenB: number = 0;

	let disabled = true;
	let loading = false;

	let timeout: NodeJS.Timeout;

	$: if (typeof $poolIssuedTokens === 'bigint' && !$poolIssuedTokens) {
		disabled = false;
	}

	async function onInputTokenLpt() {
		if (typeof $poolIssuedTokens === 'undefined') return;

		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		inputTokenB = 0;
		if (!inputTokenLpt) return;
		await new Promise((r) => (timeout = setTimeout(r, 500)));
		loading = true;

		const SCALE = 100_000_000_000_000;

		const ratio = (BigInt(inputTokenLpt * 1e6) * BigInt(SCALE)) / BigInt($poolIssuedTokens);
		const voiBalance = $currentPoolState.amount - ($currentPoolState['min-balance'] ?? 100_000);
		const viaBalance = $poolArc200Balance ?? 0;
		loading = false;

		inputTokenA = Math.floor(Number(BigInt(voiBalance) * ratio) / SCALE) / voiToken.unit;
		inputTokenB = Math.floor(Number(BigInt(viaBalance) * ratio) / SCALE) / arc200Token.unit;

		disabled = !inputTokenB;
	}

	async function onInputTokenA() {
		if (!$poolIssuedTokens) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenB = 0;
		if (!inputTokenA) return;
		await new Promise((r) => (timeout = setTimeout(r, 500)));
		loading = true;
		const voiBalance = $currentPoolState.amount - ($currentPoolState['min-balance'] ?? 100_000);
		const viaBalance = $poolArc200Balance;
		loading = false;

		const ratio = Number(convertDecimals(viaBalance, arc200Token.decimals, 6)) / 1e6 / (voiBalance / voiToken.unit);

		if (ratio) {
			inputTokenB = Number(Math.floor(inputTokenA * ratio * tokenB.unit) / tokenB.unit);
			disabled = !inputTokenB;
		}
	}

	async function onInputTokenB() {
		if (!$poolIssuedTokens) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		if (!inputTokenB) return;
		await new Promise((r) => (timeout = setTimeout(r, 500)));
		loading = true;
		const voiBalance = $currentPoolState.amount - ($currentPoolState['min-balance'] ?? 100_000);
		const viaBalance = $poolArc200Balance;
		loading = false;

		const ratio = voiBalance / voiToken.unit / (Number(convertDecimals(viaBalance, arc200Token.decimals, 6)) / 1e6);

		if (ratio) {
			inputTokenA = Number(Math.floor(inputTokenB * ratio * tokenA.unit) / tokenA.unit);
			disabled = !inputTokenA;
		}
	}

	async function changeLiquidity() {
		const prev = disabled;
		disabled = true;
		const algoArc200PoolConnector = new AlgoArc200PoolConnector(matchedPool.arc200Asset.assetId, matchedPool.poolId);

		const liquidityActionData = {
			address: $connectedAccount,
			pool_id: matchedPool.poolId,
			arc200_id: matchedPool.arc200Asset.assetId,
			arc200_symbol: matchedPool.arc200Asset.symbol,
		};

		if (action === 'add') {
			const algoAmount = BigInt(Math.floor(inputTokenA * tokenA.unit));
			const arc200Amount = BigInt(Math.floor(inputTokenB * tokenB.unit));
			const txnId = await algoArc200PoolConnector.invoke('mint', algoAmount, arc200Amount);
			saveVoiActionToList('add-liquidity', {
				...liquidityActionData,
				timestamp: Date.now(),
				txn_id: txnId,
				amount_voi: algoAmount.toString(),
				amount_arc200: arc200Amount.toString(),
			});
			pageContentRefresh(0);
		} else if (action === 'remove') {
			const lptAmount = BigInt(Math.floor(inputTokenLpt * 1e6));
			const txnId = await algoArc200PoolConnector.invoke('burn', lptAmount);
			saveVoiActionToList('remove-liquidity', {
				...liquidityActionData,
				timestamp: Date.now(),
				txn_id: txnId,
				amount_lpt: lptAmount.toString(),
			});
			pageContentRefresh(0);
		}
		disabled = prev;
	}

	$: maxLptBalanceError = Number(inputTokenLpt) > algosdk.microalgosToAlgos(Number($userLptBalance ?? 0));
	$: maxBalanceError =
		Number(inputTokenA) >
		Math.max(0, $connectedUserState.amount - (($connectedUserState['min-balance'] ?? 0) + 100_000)) / tokenA.unit;
	$: maxArc200BalanceError =
		Number(inputTokenB) > Number(convertDecimals($userArc200Balance ?? 0n, tokenB.decimals, 6)) / 1e6;

	$: maxError = action === 'remove' ? maxLptBalanceError : maxBalanceError || maxArc200BalanceError;

	let lastPoolArc200Balance = 0n;
	let lastPoolAlgoBalance = 0;

	function change() {
		if (action === 'remove') {
			onInputTokenLpt();
		} else {
			if (inputTokenA) {
				onInputTokenA();
				lastPoolArc200Balance = $poolArc200Balance;
				lastPoolAlgoBalance = $currentPoolState.amount;
			}
		}
	}
	$: if (
		$poolArc200Balance &&
		$currentPoolState.amount &&
		($poolArc200Balance !== lastPoolArc200Balance || $currentPoolState.amount !== lastPoolAlgoBalance)
	) {
		change();
	}
</script>

{#if voiToken && arc200Token}
	<LiquidityForm
		disabled={!loaded || !inputTokenB || !inputTokenA || maxError}
		tokenLptBalance={Number(convertDecimals($userLptBalance ?? 0n, 6, 6)) / 1e6}
		tokenABalance={Number(convertDecimals(formData.tokenABalance ?? 0n, tokenA.decimals, 6)) / 1e6}
		tokenBBalance={Number(convertDecimals(formData.tokenBBalance ?? 0n, tokenB.decimals, 6)) / 1e6}
		poolShare={(Number($userLptBalance) * 100) / Number($poolIssuedTokens)}
		{poolTokenABalance}
		{poolTokenBBalance}
		{action}
		bind:tokenLptInput={inputTokenLpt}
		bind:tokenAInput={inputTokenA}
		bind:tokenBInput={inputTokenB}
		{tokenA}
		{tokenB}
		{onInputTokenLpt}
		{onInputTokenA}
		{onInputTokenB}
		handleSubmit={() => ($connectedAccount ? (disabled ? null : changeLiquidity()) : openModal(ConnectWallet, {}))}
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
