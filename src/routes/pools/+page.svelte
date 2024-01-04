<script lang="ts">
	import { type Token, knownTokens, knownPools } from '$lib';
	import { currentAppId } from '$lib/_deployed';
	import { balanceString, getArc200Balance, getBalance, viaAppId } from '$lib/_shared';
	import { onChainStateWatcher, type AccountState } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	const currentPoolState = onChainStateWatcher.getAccountWatcher(algosdk.getApplicationAddress(currentAppId));

	const poolsState: Record<string, AccountState> = {};

	onMount(() => {
		const watchers: ReturnType<typeof onChainStateWatcher.getAccountWatcher>[] = [];
		const subscribers: Function[] = [];
		for (const pool of knownPools) {
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
</script>

<section class="p-4 pl-8 sm:pl-16">
	<br />
	<br />
	<h4 class="text-xl font-bold">Liquidity Pools</h4>
	<div class="flex flex-wrap items-stretch gap-2 pt-6">
		{#each knownPools as pool}
			<div class="pool bg-base-300 p-4 rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px]">
				<span class="name text-lg font-bold text-bold mb-2">VOI / {pool.arc200Asset.symbol}</span>
				<span class="flex justify-between">
					{#if poolsState[pool.poolId]?.arc200Balances[pool.arc200Asset.assetId]}
						<span class="border-r-[1px] pr-3 border-base-content border-opacity-25">
							{(poolsState[pool.poolId].amount / 1e6).toLocaleString('en')} VOI
						</span>
						<span class="border-0">
							{(
								poolsState[pool.poolId].arc200Balances[pool.arc200Asset.assetId] / pool.arc200Asset.unit
							).toLocaleString('en')}
							{pool.arc200Asset.symbol}
						</span>
					{:else}
						<span class="loading w-[1rem]" />
					{/if}
				</span>
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
</section>
