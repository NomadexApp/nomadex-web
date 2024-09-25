<script lang="ts">
	import { type Token, knownTokens, knownPools, type Pool } from '$lib';
	import { getStores } from '$app/stores';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import algosdk from 'algosdk';
	import SwapPage from './SwapPage.svelte';
	import BalanceSubscriber from '../../../../liquidity/[poolId]/[action]/BalanceSubscriber.svelte';
	import { convertDecimals } from '$lib/numbers';
	import Swap from './Swap.svelte';

	const { page } = getStores();

	const tokenA = <Token>$knownTokens.find((token) => token.id === Number($page.params.aId));
	const tokenB = <Token>$knownTokens.find((token) => token.id === Number($page.params.bId));

	let pool: Pool = <any>undefined;

	let alphaToken: Token;
	let betaToken: Token;

	if (tokenA && tokenB) {
		const match = $knownPools.find((pool) => {
			const assetIds = [pool.assets[0].id, pool.assets[1].id];
			return assetIds.includes(tokenA.id) && assetIds.includes(tokenB.id) && tokenA.id !== tokenB.id;
		});
		if (match) pool = match;
	}

	if (!pool || !tokenA || !tokenB) {
		console.error('pool not found');
	} else {
		[alphaToken, betaToken] = pool.assets;
	}

	$: poolTokenAKey = `${algosdk.getApplicationAddress(pool.poolId)}:${tokenA.id}`;
	$: poolTokenBKey = `${algosdk.getApplicationAddress(pool.poolId)}:${tokenB.id}`;
	$: userTokenAKey = `${$connectedAccount}:${tokenA.id}`;
	$: userTokenBKey = `${$connectedAccount}:${tokenB.id}`;
</script>

{#if alphaToken && betaToken}
	<BalanceSubscriber
		subscriptions={{
			[userTokenAKey]: tokenA,
			[userTokenBKey]: tokenB,
			[poolTokenAKey]: tokenA,
			[poolTokenBKey]: tokenB,
		}}
		let:result
		let:updateBalances
	>
		{@const userTokenABalance = result[userTokenAKey]}
		{@const userTokenBBalance = result[userTokenBKey]}
		{@const poolTokenABalance = result[poolTokenAKey]}
		{@const poolTokenBBalance = result[poolTokenBKey]}

		{@const userTokenABalanceInRange = Number(convertDecimals(userTokenABalance, tokenA.decimals, 6)) / 1e6}
		{@const userTokenBBalanceInRange = Number(convertDecimals(userTokenBBalance, tokenB.decimals, 6)) / 1e6}
		{@const poolTokenABalanceInRange = Number(convertDecimals(poolTokenABalance, tokenA.decimals, 6)) / 1e6}
		{@const poolTokenBBalanceInRange = Number(convertDecimals(poolTokenBBalance, tokenB.decimals, 6)) / 1e6}

		<Swap let:handleSwap>
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
		</Swap>
	</BalanceSubscriber>
{:else}
	<h3>Token Not Found</h3>
{/if}
