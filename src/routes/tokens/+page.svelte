<script lang="ts">
	import { onMount } from 'svelte';
	import { knownPools, knownTokens, TokenType } from '$lib';
	import { onChainStateWatcher, type AccountState } from '$lib/stores/onchain';
	import { goto } from '$app/navigation';
	import algosdk from 'algosdk';
	import { Arc200Interface } from '$lib/utils';

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

<section class="p-2">
	<div class="flex flex-col justify-center items-center gap-2 pt-4 relative">
		<div class="flex justify-between items-center max-w-[800px] w-full">
			<h4 class="text-xl font-bold w-full mb-0">Tokens</h4>
			<a href="/tokens/arc200-import" class="btn btn-sm btn-ghost">Import</a>
			<a href="/tokens/arc200-create" class="btn btn-sm btn-ghost">Create</a>
		</div>
		<div class="tokens max-w-[800px]">
			{#each $knownTokens as token}
				<div
					class="pool hover:bg-[#00000040] bg-[#00000033] backdrop-blur-[5px] p-4 rounded-btn flex flex-col gap-2 w-full max-w-[800px]"
					class:cursor-pointer={token.type === TokenType.ARC200}
					on:click={() => (token.type === TokenType.ARC200 ? goto(`/tokens/arc200-${token.id}`) : '')}
					on:keydown
				>
					<div class="flex justify-between">
						<span class="flex w-full items-center gap-2">
							<span class="name text-lg text-bold">
								{#if token.id}
									{token.symbol}
								{:else}
									{token.symbol}
								{/if}
							</span>
							<span class="flex-grow" />
							<span>{token.type}</span>
						</span>

						<!-- {#if token.type === TokenType.ARC200}
							(arc200)
						{/if} -->
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="br" />
	<div class="br" />
	<div class="br" />
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
	.tokens {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 8px;
	}
</style>
