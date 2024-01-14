<script lang="ts">
	import { onMount } from 'svelte';
	import { knownPools } from '$lib';
	import { onChainStateWatcher, type AccountState } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { getASABalance } from '$lib/_shared';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { get, writable } from 'svelte/store';

	const poolsState: Record<string, AccountState> = {};

	onMount(() => {
		const watchers: ReturnType<typeof onChainStateWatcher.getAccountWatcher>[] = [];
		const subscribers: Function[] = [];
		for (const pool of $knownPools) {
			const watcher = onChainStateWatcher.getAccountWatcher(algosdk.getApplicationAddress(pool.poolId));
			watchers.push(watcher);
			subscribers.push(
				watcher.subscribe((state) => {
					poolsState[pool.poolId] = state;
				})
			);
		}

		return () => {
			for (const unsub of subscribers) {
				unsub?.();
			}
		};
	});
	let positionCount = writable(0);
</script>

<section class="p-4">
	<br />
	<br />
	<div class="flex flex-col justify-center items-center gap-2 pt-6">
		<h4 class="text-xl font-bold prose w-full mb-5">Popular Liquidity Pools</h4>
		{#each $knownPools as pool}
			<div
				class="pool bg-base-300 p-4 rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px]"
			>
				<div class="flex justify-between">
					<span class="name text-lg font-bold text-bold mb-2">VOI / {pool.arc200Asset.symbol}</span>
					<span class="">
						{#if poolsState[pool.poolId]?.arc200Balances[pool.arc200Asset.assetId]}
							<span class="">
								{(poolsState[pool.poolId].amount / 1e6).toLocaleString('en')} VOI
							</span>
							/
							<span class="">
								{(
									poolsState[pool.poolId].arc200Balances[pool.arc200Asset.assetId] / pool.arc200Asset.unit
								).toLocaleString('en')}
								{pool.arc200Asset.symbol}
							</span>
						{:else}
							<span class="loading w-[1rem]" />
						{/if}
					</span>
				</div>
				<span class="flex flex-wrap justify-end">
					<a href="/swap/VOI-{pool.arc200Asset.symbol}" class="btn btn-ghost text-base-content btn-sm">Swap</a>
					<a href="/liquidity/VOI-{pool.arc200Asset.symbol}/add" class="btn btn-ghost text-base-content btn-sm">
						Add Liq.
					</a>
					<a href="/liquidity/VOI-{pool.arc200Asset.symbol}/remove" class="btn btn-ghost text-base-content btn-sm">
						Remove Liq.
					</a>
				</span>
			</div>
		{/each}
	</div>
	<br />
	<div
		class="flex flex-col justify-center items-center gap-2 pt-6 transition-opacity duration-200 {$positionCount
			? 'opacity-100'
			: 'opacity-0'}"
	>
		<h4 class="text-xl font-bold prose w-full mb-5">Your Positions</h4>
		{#each $knownPools as pool}
			{#await Promise.all( [getASABalance(pool.lptId, $connectedAccount), getASABalance(pool.lptId, algosdk.getApplicationAddress(pool.poolId))] ) then [lptBalance, poolBalance]}
				{#if lptBalance > 0}
					{(Boolean(positionCount.set(get(positionCount) + 1)) && '') || ''}
					<div
						class="pool bg-base-300 p-4 rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px]"
					>
						<div class="flex justify-between">
							<span class="name text-lg font-bold text-bold mb-2">VOI / {pool.arc200Asset.symbol}</span>
							<span class="" />
							<span>
								{((lptBalance / 1e6 / ((1e16 - poolBalance) / 1e6)) * 100).toLocaleString('en')}% Share
							</span>
						</div>
						<span class="flex flex-wrap justify-end">
							<a href="/liquidity/VOI-{pool.arc200Asset.symbol}/add" class="btn btn-ghost text-base-content btn-sm">
								Add Liq.
							</a>
							<a href="/liquidity/VOI-{pool.arc200Asset.symbol}/remove" class="btn btn-ghost text-base-content btn-sm">
								Remove Liq.
							</a>
						</span>
					</div>
				{/if}
			{/await}
		{/each}
	</div>
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
