<script lang="ts">
	import { knownTokens, knownPools, tokensAndPoolsRefresh } from '$lib';
	import { getStores } from '$app/stores';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { pageContentRefresh } from '$lib/utils';
	import algosdk from 'algosdk';
	import { convertDecimals } from '$lib/utils/numbers';
	import LiquidityForm from '$lib/components/form/LiquidityForm.svelte';
	import { openModal } from '$lib/components/modal/Modal.svelte';
	import ConnectWallet from '$lib/components/modal/ConnectWallet.svelte';
	import BalanceSubscriber from '$lib/components/BalanceSubscriber.svelte';
	import { SCALE } from '$lib/../contracts/pool/constants';
	import ChangeLiquidity from './ChangeLiquidity.svelte';

	const { page } = getStores();
	const pool = $knownPools.find((pool) => pool.poolId === Number($page.params.poolId));
	if (!pool) throw Error('pool not found');

	const tokenA = pool.assets[0];
	const tokenB = pool.assets[1];

	const LPT_TOTAL_SUPPLY = BigInt(SCALE) * 10n ** 6n;

	let action = $page.params.action;

	let inputTokenLpt = $state(0);
	let inputTokenA = $state(0);
	let inputTokenB = $state(0);

	let disabled = $state(false);
	let loading = $state(false);

	let timeout = $state<NodeJS.Timeout>();

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

		inputTokenA = Number((ratio * BigInt(poolTokenABalance)) / BigInt(1e14)) / 10 ** tokenA.decimals;
		inputTokenB = Number((ratio * BigInt(poolTokenBBalance)) / BigInt(1e14)) / 10 ** tokenB.decimals;
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
		const ratio =
			Number(convertDecimals(poolTokenBBalance, tokenB.decimals, 6)) /
			Number(convertDecimals(poolTokenABalance, tokenA.decimals, 6));
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

		const ratio =
			Number(convertDecimals(poolTokenABalance, tokenA.decimals, 6)) /
			Number(convertDecimals(poolTokenBBalance, tokenB.decimals, 6));

		if (ratio) {
			inputTokenA = Number(Math.floor(inputTokenB * ratio * tokenA.unit) / tokenA.unit);
			disabled = !inputTokenA;
		}
	}

	let poolTokenAKey = $state(`${algosdk.getApplicationAddress(pool.poolId)}:${tokenA.id}`);
	let poolTokenBKey = $state(`${algosdk.getApplicationAddress(pool.poolId)}:${tokenB.id}`);
	let poolLptKey = $state(`${algosdk.getApplicationAddress(pool.poolId)}:${pool.poolId}`);
	let userAlgoKey = $state(`${$connectedAccount}:0`);
	let userTokenAKey = $state(`${$connectedAccount}:${tokenA.id}`);
	let userTokenBKey = $state(`${$connectedAccount}:${tokenB.id}`);
	let userLptKey = $state(`${$connectedAccount}:${pool.poolId}`);

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
	>
		{#snippet balance_result(result, updateBalances)}
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
			{@const maxBalanceError =
				Number(inputTokenA) > userTokenABalanceInRange || Number(inputTokenB) > userTokenBBalanceInRange}
			{@const maxError = action === 'remove' ? maxLptBalanceError : maxBalanceError}

			<ChangeLiquidity
				onUpdate={() => {
					updateBalances();
					tokensAndPoolsRefresh();
				}}
			>
				{#snippet child?.(addLiquidity, removeLiquidity)}
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
								if (!disabled) {
									try {
										if (action === 'add') {
											console.log(
												'Add:',
												await addLiquidity({
													pool,
													tokenA,
													tokenB,
													inputTokenA,
													inputTokenB,
												})
											);
											updateBalances();
										} else if (action === 'remove') {
											console.log(
												'Remove:',
												await removeLiquidity({
													pool,
													inputTokenLpt,
												})
											);
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
				{/snippet}
			</ChangeLiquidity>
		{/snippet}
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
