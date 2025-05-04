<script lang="ts">
	import { onMount } from 'svelte';
	import { knownPools, knownTokens, TokenType } from '$lib';
	import { onChainStateWatcher, type AccountState } from '$lib/stores/onchain';
	import algosdk from 'algosdk';
	import { getWellknownAssetIds } from '$lib/wellknown';

	const poolsState: Record<string, AccountState> = {};

	const wellknown = getWellknownAssetIds();

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
			<a href="/tokens/create" class="btn btn-sm btn-ghost">Create</a>
		</div>
		<div class="tokens max-w-[800px]">
			{#each $knownTokens as token}
				<div
					class="pool hover:bg-[#00000040] bg-[#00000033] backdrop-blur-[5px] p-4 rounded-btn flex flex-col gap-2 w-full max-w-[800px]"
					class:cursor-pointer={token.type === TokenType.SMART}
				>
					<div class="flex justify-between">
						<a
							href={token.type === TokenType.ALGO
								? null
								: `/tokens/${token.id}/${token.type === TokenType.SMART ? 'smart' : token.type === TokenType.ASA ? 'asa' : ''}`}
							class="flex w-full items-center gap-2"
						>
							{#if wellknown.includes(token.id)}
								<span class="rounded-full overflow-hidden">
									<img src="/tokens/{token.id}.png" alt="" class="max-w-6" />
								</span>
							{/if}
							<span class="name text-lg text-bold">
								{#if token.id}
									{token.symbol}
								{:else}
									{token.symbol}
								{/if}
							</span>
							<span class="flex-grow"></span>
							<span>{token.id}</span>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="br"></div>
	<div class="br"></div>
	<div class="br"></div>
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
