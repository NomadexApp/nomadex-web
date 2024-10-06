<script lang="ts">
	import { type Token, knownTokens, knownPools } from '$lib';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';
	import algosdk from 'algosdk';
	import { convertDecimals } from '$lib/utils/numbers';
	import LiquidityForm from '$lib/components/form/LiquidityForm.svelte';
	import { openModal } from '$lib/components/modal/Modal.svelte';
	import ConnectWallet from '$lib/components/modal/ConnectWallet.svelte';
	import { writable } from 'svelte/store';
	import BalanceSubscriber from './BalanceSubscriber.svelte';
	import { SCALE } from '../../../../contracts/pool/constants';
	import ChangeLiquidity from './ChangeLiquidity.svelte';

	const { page } = getStores();
	const pool = $knownPools.find((pool) => pool.poolId === Number($page.params.poolId));
	if (!pool) throw Error('pool not found');

	const tokenA = pool.assets[0];
	const tokenB = pool.assets[1];

	const LPT_TOTAL_SUPPLY = BigInt(SCALE) * 10n ** 6n;

	let action = $page.params.action;

	let tokens: [Token, Token] | undefined = [tokenA, tokenB];

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
		if (aToken.symbol !== tokenA.symbol || bToken.symbol !== tokenB.symbol) {
			goto(`/liquidity/${bToken.symbol}`, { replaceState: true });
			pageContentRefresh(0);
		}
	}

	$: browser && tokens && tokenA && tokenB && updateRoute(tokenA, tokenB);

	let inputTokenLpt: number = 0;
	let inputTokenA: number = 0;
	let inputTokenB: number = 0;

	let disabled = false;
	let loading = false;

	let timeout: NodeJS.Timeout;

	type InputLptOpts = Record<'poolLptBalance' | 'poolTokenABalance' | 'poolTokenBBalance', bigint | number>;
	async function onInputTokenLpt({ poolLptBalance, poolTokenABalance, poolTokenBBalance }: InputLptOpts) {
		if (poolLptBalance >= LPT_TOTAL_SUPPLY) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		inputTokenB = 0;
		if (!inputTokenLpt) return;
		await new Promise((r) => (timeout = setTimeout(r, 500)));
		loading = true;
		const ratio = convertDecimals(inputTokenLpt * 1e6, 6, 20) / BigInt(LPT_TOTAL_SUPPLY - BigInt(poolLptBalance));
		loading = false;

		inputTokenA = Number((ratio * BigInt(poolTokenABalance)) / BigInt(1e14)) / 1e6;
		inputTokenB = Number((ratio * BigInt(poolTokenBBalance)) / BigInt(1e14)) / 1e6;
		disabled = !inputTokenB || !inputTokenA;
	}

	type InputTokenAOpts = Record<'poolLptBalance' | 'poolTokenABalance' | 'poolTokenBBalance', bigint | number>;
	async function onInputTokenA({ poolLptBalance, poolTokenABalance, poolTokenBBalance }: InputTokenAOpts) {
		if (poolLptBalance >= LPT_TOTAL_SUPPLY) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenB = 0;
		if (!inputTokenA) return;
		await new Promise((r) => (timeout = setTimeout(r, 500)));
		loading = false;
		const ratio = Number(poolTokenBBalance) / Number(poolTokenABalance);
		if (ratio) {
			inputTokenB = Number(Math.floor(inputTokenA * ratio * tokenB.unit) / tokenB.unit);
			disabled = !inputTokenB;
		}
	}

	type InputTokenBOpts = Record<'poolLptBalance' | 'poolTokenABalance' | 'poolTokenBBalance', bigint | number>;
	async function onInputTokenB({ poolLptBalance, poolTokenABalance, poolTokenBBalance }: InputTokenBOpts) {
		if (poolLptBalance >= LPT_TOTAL_SUPPLY) return;
		clearTimeout(timeout);
		disabled = true;
		inputTokenA = 0;
		if (!inputTokenB) return;
		await new Promise((r) => (timeout = setTimeout(r, 500)));
		loading = true;
		loading = false;

		const ratio = Number(poolTokenABalance) / Number(poolTokenBBalance);

		if (ratio) {
			inputTokenA = Number(Math.floor(inputTokenB * ratio * tokenA.unit) / tokenA.unit);
			disabled = !inputTokenA;
		}
	}

	async function changeLiquidity() {
		const prev = disabled;
		disabled = true;
		// TODO
		disabled = prev;
	}

	// let lastPoolArc200Balance = 0n;
	// let lastPoolAlgoBalance = 0;

	// function change() {
	// 	if (action === 'remove') {
	// 		onInputTokenLpt();
	// 	} else {
	// 		if (inputTokenA) {
	// 			onInputTokenA();
	// 			lastPoolArc200Balance = $poolTokenBBalance;
	// 			lastPoolAlgoBalance = $currentPoolState.amount;
	// 		}
	// 	}
	// }
	// $: if ($poolTokenBBalance && $currentPoolState.amount && ($poolTokenBBalance !== lastPoolArc200Balance || $currentPoolState.amount !== lastPoolAlgoBalance)) {
	// 	change();
	// }

	$: poolTokenAKey = `${algosdk.getApplicationAddress(pool.poolId)}:${tokenA.id}`;
	$: poolTokenBKey = `${algosdk.getApplicationAddress(pool.poolId)}:${tokenB.id}`;
	$: poolLptKey = `${algosdk.getApplicationAddress(pool.poolId)}:${pool.poolId}`;
	$: userAlgoKey = `${$connectedAccount}:0`;
	$: userTokenAKey = `${$connectedAccount}:${tokenA.id}`;
	$: userTokenBKey = `${$connectedAccount}:${tokenB.id}`;
	$: userLptKey = `${$connectedAccount}:${pool.poolId}`;

	function getPoolShare(userLpt: bigint, poolLpt: bigint) {
		const issued = LPT_TOTAL_SUPPLY - poolLpt;
		if (userLpt <= 0n) return 0;
		if (issued <= 0n) return 0;
		return Number((userLpt * 100_00n) / issued) / 100;
	}
</script>

{#if tokenA && tokenB}
	<BalanceSubscriber
		subscriptions={{
			[userAlgoKey]: $knownTokens[0],
			[userTokenAKey]: tokenA,
			[userTokenBKey]: tokenB,
			[poolTokenAKey]: tokenA,
			[poolTokenBKey]: tokenB,
			[poolLptKey]: pool,
			[userLptKey]: pool,
		}}
		let:result
		let:updateBalances
	>
		{@const poolLptBalance = result[poolLptKey]}
		{@const userLptBalance = result[userLptKey]}
		{@const userPoolShare = getPoolShare(result[userLptKey], result[poolLptKey])}
		{@const userTokenABalance = result[userTokenAKey]}
		{@const userTokenBBalance = result[userTokenBKey]}
		{@const poolTokenABalance = result[poolTokenAKey]}
		{@const poolTokenBBalance = result[poolTokenBKey]}

		{@const userLptBalanceInRange = Number(convertDecimals(userLptBalance, 6, 6)) / 1e6}
		{@const poolLptBalanceInRange = Number(convertDecimals(poolLptBalance, 6, 6)) / 1e6}
		{@const userTokenABalanceInRange = Number(convertDecimals(userTokenABalance, tokenA.decimals, 6)) / 1e6}
		{@const userTokenBBalanceInRange = Number(convertDecimals(userTokenBBalance, tokenB.decimals, 6)) / 1e6}
		{@const poolTokenABalanceInRange = Number(convertDecimals(poolTokenABalance, tokenA.decimals, 6)) / 1e6}
		{@const poolTokenBBalanceInRange = Number(convertDecimals(poolTokenBBalance, tokenB.decimals, 6)) / 1e6}

		{@const maxLptBalanceError = Number(inputTokenLpt) > userLptBalanceInRange}
		{@const maxBalanceError = Number(inputTokenA) > userTokenABalanceInRange || Number(inputTokenB) > userTokenBBalanceInRange}
		{@const maxError = action === 'remove' ? maxLptBalanceError : maxBalanceError}

		<ChangeLiquidity let:addLiquidity let:removeLiquidity onUpdate={updateBalances}>
			<LiquidityForm
				{action}
				{pool}
				{tokenA}
				{tokenB}
				bind:tokenAInput={inputTokenA}
				bind:tokenBInput={inputTokenB}
				bind:tokenLptInput={inputTokenLpt}
				disabled={disabled || !inputTokenB || !inputTokenA || maxError}
				tokenLptBalance={Number(result[userLptKey]) / 1e6}
				poolShare={userPoolShare}
				poolTokenABalance={poolTokenABalanceInRange}
				poolTokenBBalance={poolTokenBBalanceInRange}
				tokenABalance={userTokenABalanceInRange}
				tokenBBalance={userTokenBBalanceInRange}
				onInputTokenLpt={() =>
					onInputTokenLpt({
						poolLptBalance,
						poolTokenABalance,
						poolTokenBBalance,
					})}
				onInputTokenA={() =>
					onInputTokenA({
						poolLptBalance,
						poolTokenABalance,
						poolTokenBBalance,
					})}
				onInputTokenB={() =>
					onInputTokenB({
						poolLptBalance,
						poolTokenABalance,
						poolTokenBBalance,
					})}
				handleSubmit={async () => {
					if ($connectedAccount) {
						console.log(action, disabled);
						if (!disabled) {
							try {
								if (action === 'add') {
									await addLiquidity({
										pool,
										tokenA,
										tokenB,
										inputTokenA,
										inputTokenB,
									});
									updateBalances();
								} else if (action === 'remove') {
									await removeLiquidity({
										pool,
										inputTokenLpt,
									});
									updateBalances();
								}
							} catch (e) {
								console.error(`Error ${action}ing liquidity`);
								console.error(e);
							}
							pageContentRefresh(0);
						}
					} else {
						openModal(ConnectWallet, {});
					}
				}}
			/>
		</ChangeLiquidity>
	</BalanceSubscriber>
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
