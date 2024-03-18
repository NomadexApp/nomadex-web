<script lang="ts">
	import { knownPools, type Pool } from '$lib';
	import PoolInfo from '$lib/PoolInfo.svelte';
	import PoolPosition from '$lib/PoolPosition.svelte';
	import { onChainStateWatcher, watchArc200Balance, watchPoolTotalSupply } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { writable, derived, get } from 'svelte/store';

	let hasPosition = false;
	let showMore = false;

	const sortedPools = writable<(Pool & { balances: { [k: string]: any } })[]>([]);

	function update(pool: Pool) {
		const poolState = onChainStateWatcher.getAccountWatcher(algosdk.getApplicationAddress(pool.poolId));
		const poolArc200Balance = watchArc200Balance(pool.arc200Asset.assetId, algosdk.getApplicationAddress(pool.poolId));
		const poolTotalSupply = watchPoolTotalSupply(pool.poolId);

		$sortedPools = [
			...$sortedPools,
			{
				...pool,
				balances: {
					algo: derived(poolState, (state) => state.amount),
					arc200: derived(poolArc200Balance, (state) => state),
					lpt: derived(poolTotalSupply, (state) => state),
				},
			},
		];

		const unsub = poolState.subscribe((v) => {
			$sortedPools = [...$sortedPools];
			setTimeout(() => {
				if (v.amount) unsub();
			});
		});
		const unsub1 = poolArc200Balance.subscribe((v) => {
			$sortedPools = [...$sortedPools];
			setTimeout(() => {
				if (v) unsub1();
			});
		});
		const unsub2 = poolTotalSupply.subscribe((v) => {
			$sortedPools = [...$sortedPools];
			setTimeout(() => {
				if (v) unsub2();
			});
		});
	}

	$: {
		$sortedPools = [];
		for (const pool of $knownPools) {
			update(pool);
		}
	}
</script>

<section class="p-4">
	<br />
	<br />
	<div class="flex flex-col justify-center items-center gap-2 pt-6">
		<h4 class="text-xl font-bold prose w-full mb-5">Liquidity Pools</h4>
		{#each $sortedPools
			.sort((pool, pool1) => Number(get(pool1.balances.algo)) - Number(get(pool.balances.algo)))
			.slice(0, showMore ? 1_000 : 5) as pool (pool.poolId)}
			<PoolInfo {pool} />
		{/each}
		{#if !showMore}
			<button class="btn btn-ghost btn-sm" on:click={() => (showMore = !showMore)}>Show More</button>
		{/if}
	</div>
	<br />
	<div
		class="flex flex-col justify-center items-center gap-2 pt-6 transition-opacity duration-200"
		style={hasPosition ? 'opacity: 1;' : 'opacity: 0;margin-top:-3rem;height: 0 !important;overflow: 0;'}
	>
		<h4 class="text-xl font-bold prose w-full mb-5">Your Positions</h4>
		{#each $sortedPools.sort((pool, pool1) => Number(get(pool1.balances.algo)) - Number(get(pool.balances.algo))) as pool (pool.poolId)}
			<PoolPosition {pool} exists={() => (hasPosition = true)} />
		{/each}
	</div>
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
