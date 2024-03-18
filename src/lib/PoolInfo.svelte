<script lang="ts">
	import type { Pool } from '$lib';
	import { convertDecimals } from './numbers';

	export let pool: Pool & { balances: { [k: string]: any } };

	const algoBalance = pool.balances.algo;
	const arc200Balance = pool.balances.arc200;
	const lptBalance = pool.balances.lpt;
</script>

<div class="pool bg-base-200 p-4 rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px]">
	<div class="flex justify-between">
		<span class="name text-lg">VOI / {pool.arc200Asset.symbol}</span>
		<span class="">
			{#if ($lptBalance ?? 0n) > 0n}
				{#if $arc200Balance}
					<span class="">
						{($algoBalance / 1e6).toLocaleString('en')} VOI
					</span>
					/
					<span class="">
						{(Number(convertDecimals($arc200Balance, pool.arc200Asset.decimals, 6)) / 1e6).toLocaleString('en')}
						{pool.arc200Asset.symbol}
					</span>
				{:else}
					<span class="loading w-[1rem]" />
				{/if}
			{/if}
		</span>
	</div>
	<span class="flex flex-wrap justify-end">
		<a href="/swap/VOI-{pool.arc200Asset.symbol}" class="btn btn-ghost text-base-content btn-sm">Swap</a>
		<a href="/liquidity/VOI-{pool.arc200Asset.symbol}/add" class="btn btn-ghost text-base-content btn-sm"> Add Liq. </a>
		<a href="/liquidity/VOI-{pool.arc200Asset.symbol}/remove" class="btn btn-ghost text-base-content btn-sm">
			Remove Liq.
		</a>
	</span>
</div>
