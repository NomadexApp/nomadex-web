<script lang="ts">
	import type { Pool } from '$lib';
	import { readableNumber } from './CurrencyNumber.svelte';

	export let pool: Pool;
	export let balances:
		| {
				alpha: bigint;
				beta: bigint;
				lpt: bigint;
				issuedLpt: bigint;
		  }
		| undefined;
	export let my = false;

	const [tokenA, tokenB] = pool.assets;

	$: sharePercent = balances ? Number((balances.lpt * 100_00n) / balances.issuedLpt) / 100 : 0;
</script>

<div class="pool sm:grid bg-[#00000033] sm:bg-transparent rounded-[8px]">
	<div class="name flex gap-2 w-full">
		<div class="hidden sm:flex icon avatar w-7 h-7 bg-[#666633] rounded-full justify-center items-center">?</div>
		<div class="hidden sm:flex icon avatar w-7 h-7 bg-[#666666] rounded-full justify-center items-center ml-[-1.25rem]">?</div>
		<span class="text-nowrap inline-flex items-center">
			{tokenB.symbol} <span class="text-gray-300 mx-1">/</span>{tokenA.symbol}
		</span>
	</div>
	<div class="flex items-center w-[40%] sm:w-[50px] text-nowrap">
		{readableNumber((pool.tvl / 1e6) * (my ? sharePercent / 100 : 1))} VOI
	</div>
	<div class="hidden sm:inline-flex items-center w-[40%] sm:w-[50px] text-nowrap">
		{readableNumber(Number(pool.volume ?? 0) / 1e6)} VOI
	</div>
	<div class="flex sm:inline-flex items-center w-[40%] sm:w-[50px] text-nowrap">
		{Math.max(0, Number((pool.apr ?? 0).toFixed((pool.apr ?? 0) > 10 ? 0 : 2)))} %
	</div>
	<div class="w-full flex justify-end">
		{#if balances && balances.lpt > 0n}
			<button class="btn btn-sm btn-square btn-ghost text-white">
				<a class="scale-150 font-thin" href="/liquidity/{pool.id}/remove">-</a>
			</button>
		{/if}
		<button class="btn btn-sm btn-square btn-ghost text-white">
			<a class="scale-150 font-thin" href="/liquidity/{pool.id}/add">+</a>
		</button>
	</div>
</div>

<style>
	.pool > div:not(.hidden) {
		display: inline-flex;
	}
</style>
