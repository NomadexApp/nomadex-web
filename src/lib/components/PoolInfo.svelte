<script lang="ts">
	import { knownAprBoost, type Pool } from '$lib';
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
	export let online = false;

	const [tokenA, tokenB] = pool.assets;

	$: sharePercent = balances ? Number((balances.lpt * 100_00n) / balances.issuedLpt) / 100 : 0;
</script>

<div class="pool sm:grid bg-[#00000033] sm:bg-transparent rounded-[8px]">
	<div class="name flex gap-0 w-full">
		<object
			title={tokenA.symbol}
			data="/tokens/{tokenA.id}.png"
			type="image/png"
			class="hidden sm:flex icon avatar w-7 h-7 bg-[#3a635f] rounded-full justify-center items-center"
		>
			?
		</object>
		<object
			title={tokenB.symbol}
			data="/tokens/{tokenB.id}.png"
			type="image/png"
			class="hidden sm:flex icon avatar w-7 h-7 bg-[#594480] rounded-full justify-center items-center -translate-x-3"
		>
			?
		</object>
		<div class="inline-flex justify-center items-center mr-2">
			<span
				class="inline-flex w-2 h-2 rounded-full {online ? 'bg-green-500 animate-online' : 'bg-gray-100 opacity-10'}"
				title={online ? 'Consensus: Participating' : 'Consensus: Not Participating'}
			></span>
		</div>

		<span class="text-nowrap inline-flex items-center">
			{tokenA.symbol}<span class="text-gray-300 mx-1">/</span>{tokenB.symbol}
		</span>
	</div>
	<div class="flex items-center w-[40%] sm:w-[50px] text-nowrap">
		{readableNumber((pool.tvl / 1e6) * (my ? sharePercent / 100 : 1))} VOI
	</div>
	<div class="hidden sm:inline-flex items-center w-[40%] sm:w-[50px] text-nowrap">
		{readableNumber(Number(pool.volume[0] ?? 0) / 10 ** tokenA.decimals)}
		{tokenA.symbol}
	</div>
	<div class="flex sm:inline-flex items-center w-[40%] sm:w-[50px] text-nowrap">
		{Math.max(0, Number(((pool.apr ?? 0) + (knownAprBoost[pool.poolId] ?? 0)).toFixed((pool.apr ?? 0) > 10 ? 0 : 2)))} %
	</div>
	<div class="w-full flex justify-end">
		<button aria-label={null} class="btn btn-sm btn-square btn-ghost text-white">
			<a
				aria-label={null}
				class="scale-150 font-thin"
				href="/{pool.assets[0].type}/{pool.assets[0].id}/{pool.assets[1].type}/{pool.assets[1].id}"
			>
				<svg
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					style="width: 10px;"
				>
					<polyline points="17 1 21 5 17 9" />
					<path d="M21 5H3v8" />
					<polyline points="7 23 3 19 7 15" />
					<path d="M3 19h18v-8" />
				</svg>
			</a>
		</button>
		<button class="btn btn-sm btn-square btn-ghost text-white">
			<a class="scale-150 font-thin" href="/liquidity/{pool.id}/add">+</a>
		</button>
		{#if balances && balances.lpt > 0n}
			<button class="btn btn-sm btn-square btn-ghost text-white">
				<a class="scale-150 font-thin" href="/liquidity/{pool.id}/remove">-</a>
			</button>
		{/if}
	</div>
</div>

<style>
	.pool > div:not(.hidden) {
		display: inline-flex;
	}
	.animate-online {
		animation: bubble 5s infinite ease-in;
	}
	@keyframes bubble {
		0% {
			transform: scale(0.7);
			opacity: 1;
		}
		99% {
			transform: scale(1);
			opacity: 0.2;
		}
		100% {
			transform: scale(0.7);
			opacity: 1;
		}
	}
</style>
