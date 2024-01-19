<script lang="ts">
	import { onMount } from 'svelte';
	import { knownPools, knownTokens, TokenType } from '$lib';
	import { onChainStateWatcher, type AccountState } from '$lib/stores/onchain';
	import { goto } from '$app/navigation';
	import algosdk from 'algosdk';

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
</script>

<section class="p-4">
	<br />
	<br />
	<div class="flex flex-col justify-center items-center gap-2 pt-6 relative">
		<div class="flex justify-between max-w-[800px] w-full">
			<h4 class="text-xl font-bold prose w-full mb-5">Tokens</h4>
			<a href="/tokens/arc200-create" class="btn btn-ghost">Create Arc200 Token</a>
		</div>
		{#each $knownTokens as token}
			<div
				class="pool bg-base-200 p-4 rounded-btn flex flex-col gap-2 min-w-[100px] sm:min-w-[300px] w-full max-w-[800px]"
				class:cursor-pointer={token.type === TokenType.ARC200}
				on:click={() => (token.type === TokenType.ARC200 ? goto(`/tokens/arc200-${token.id}`) : '')}
				on:keydown
			>
				<div class="flex justify-between">
					<span class="name text-lg font-bold text-bold mb-2">
						{token.ticker}
						{#if token.type === TokenType.ARC200}
							(arc200)
						{/if}
					</span>
				</div>
			</div>
		{/each}
	</div>
	<br />
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
