<script lang="ts">
	import { type Token, knownTokens, knownPools, type Pool, tokensAndPoolsRefresh } from '$lib';
	import { getStores } from '$app/stores';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import algosdk from 'algosdk';
	import SwapPage from './SwapPage.svelte';
	import BalanceSubscriber from '$lib/components/BalanceSubscriber.svelte';
	import { convertDecimals } from '$lib/utils/numbers';
	import Swap from './Swap.svelte';

	const { page } = getStores();

	const tokenA = $knownTokens.find((token) => token.id === Number($page.params.aId)) as Token;
	const tokenB = $knownTokens.find((token) => token.id === Number($page.params.bId)) as Token;

	let pool = $state(
		$knownPools.find((pool) => {
			if (!tokenA || !tokenB) return;
			const assetIds = [pool.assets[0].id, pool.assets[1].id];
			return assetIds.includes(tokenA.id) && assetIds.includes(tokenB.id) && tokenA.id !== tokenB.id;
		}) as Pool
	);

	let alphaToken = $derived(pool.assets[0]);
	let betaToken = $derived(pool.assets[1]);

	let poolTokenAKey = $derived(pool ? `${algosdk.getApplicationAddress(pool.poolId)}:${tokenA.id}` : '');
	let poolTokenBKey = $derived(pool ? `${algosdk.getApplicationAddress(pool.poolId)}:${tokenB.id}` : '');
	let userTokenAKey = $derived(`${$connectedAccount}:${tokenA.id}`);
	let userTokenBKey = $derived(`${$connectedAccount}:${tokenB.id}`);
</script>

{#if tokenA && tokenB}
	<BalanceSubscriber
		subscriptions={{
			[userTokenAKey]: tokenA,
			[userTokenBKey]: tokenB,
			[poolTokenAKey]: tokenA,
			[poolTokenBKey]: tokenB,
		}}
	>
		{#snippet balance_result(result, updateBalances)}
			{@const userTokenABalance = result[userTokenAKey]}
			{@const userTokenBBalance = result[userTokenBKey]}
			{@const poolTokenABalance = result[poolTokenAKey]}
			{@const poolTokenBBalance = result[poolTokenBKey]}

			{@const userTokenABalanceInRange = Number(convertDecimals(userTokenABalance, tokenA.decimals, 6)) / 1e6}
			{@const userTokenBBalanceInRange = Number(convertDecimals(userTokenBBalance, tokenB.decimals, 6)) / 1e6}
			{@const poolTokenABalanceInRange = Number(convertDecimals(poolTokenABalance, tokenA.decimals, 6)) / 1e6}
			{@const poolTokenBBalanceInRange = Number(convertDecimals(poolTokenBBalance, tokenB.decimals, 6)) / 1e6}

			<Swap
				onUpdate={() => {
					updateBalances();
					tokensAndPoolsRefresh();
				}}
			>
				{#snippet child?.(handleSwap)}
					<SwapPage
						{tokenA}
						{tokenB}
						{pool}
						{alphaToken}
						{betaToken}
						{userTokenABalanceInRange}
						{userTokenBBalanceInRange}
						{poolTokenABalanceInRange}
						{poolTokenBBalanceInRange}
						{poolTokenABalance}
						{poolTokenBBalance}
						{handleSwap}
						{updateBalances}
					/>
				{/snippet}
			</Swap>
		{/snippet}
	</BalanceSubscriber>
	<br /><br /><br /><br /><br />
{:else}
	<h3>Token Not Found</h3>
{/if}
