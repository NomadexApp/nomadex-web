<script lang="ts">
	import type { Pool } from '$lib';
	import { getWellknownAssetIds } from '$lib/wellknown';
	import TextInput from '../form/TextInput.svelte';

	let {
		close,
		pools = [],
		handleSelect = () => {},
	}: { close: Function; pools?: Pool[]; handleSelect?: (pool: Pool) => void } = $props();

	let tokenSearch = $state('');

	let filteredPools = $derived(
		tokenSearch
			? pools.filter(
					(pool) =>
						pool.id.toString() === tokenSearch ||
						pool.assets.find((asset) => asset.symbol.toLowerCase().match(new RegExp(`^${tokenSearch.toLowerCase()}`)))
				)
			: pools
	);

	let finalPools = $derived([...filteredPools].sort((a, b) => b.tvl - a.tvl));

	const wellknown = getWellknownAssetIds();
</script>

<form>
	<h3 class="text-2xl mb-4">Select a pool</h3>
	<TextInput placeholder="Search by name or id" bind:value={tokenSearch} />
	<div class="br"></div>
	<span class="block text-xl mb-4">
		{#if tokenSearch}Matched tokens{:else}Tokens{/if}
	</span>
	<div class="tokens flex flex-col gap-2 mb-4 overflow-y-auto max-h-96">
		{#each finalPools as pool}
			<button
				class="text-left token flex gap-4 bg-[#f0f0f005] hover:bg-[#f0f0f010] rounded p-2 cursor-pointer"
				onclick={() => {
					handleSelect(pool);
					close();
				}}
			>
				<div class="flex">
					{#each pool.assets as asset, index}
						<div
							class="icon avatar w-10 h-10 flex justify-center items-center"
							style={index ? 'margin-left: -20px' : ''}
						>
							<object
								title={asset.symbol}
								data={wellknown.includes(asset.id) ? `/tokens/${asset.id}.png` : ''}
								type={wellknown.includes(asset.id) ? 'image/png' : ''}
								class="hidden sm:flex icon avatar w-7 h-7 bg-[#3a635f] rounded-full justify-center items-center"
							>
								?
							</object>
						</div>
					{/each}
				</div>
				<div class="flex flex-col text-sm flex-grow">
					<span class="name">{pool.assets[0].symbol} / {pool.assets[1].symbol}</span>
					<span class="symbol text-gray-300">{pool.id}</span>
				</div>
			</button>
		{/each}
	</div>
</form>

<div class="buttons">
	<button class="btn btn-ghost w-full" onclick={() => close()}>Close</button>
</div>

<style>
	form {
		width: 100vw;
		max-width: calc(500px - 2rem);
		overflow: hidden;
	}
	.tokens {
		display: flex;
		flex-direction: column;
	}

	.token {
		display: flex;
	}
</style>
