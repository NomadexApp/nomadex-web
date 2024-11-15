<script lang="ts">
	import { type Token, knownPools, tokensAndPoolsRefresh } from '$lib';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { pageContentRefresh } from '$lib/utils';
	import Online from './Online.svelte';

	let {} = $props();

	const { page } = getStores();
	const pool = $knownPools.find((pool) => pool.poolId === Number($page.params.poolId));
	if (!pool) throw Error('pool not found');

	const tokenA = pool.assets[0];
	const tokenB = pool.assets[1];

	let selectionPk = $state('');
	let stateProofPk = $state('');
	let votePk = $state('');
	let voteFirst = $state(0);
	let voteLast = $state(0);
	let voteKeyDilution = $state(0);
</script>

<section class="flex flex-col justify-center items-center h-full">
	{#if tokenA && tokenB}
		<Online
			let:registerOnline
			let:registerOffline
			onUpdate={() => {
				tokensAndPoolsRefresh();
			}}
		>
			<form onsubmit={(e) => e.preventDefault()} class="flex flex-col gap-2 w-full max-w-[448px]">
				<h4 class="text-left text-xl">Consensus</h4>
				<div class="h-full flex flex-col justify-start items-center gap-3 w-full">
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<div>Selection PK:</div>
						<input class="input input-secondary bg-[#00000040]" type="text" bind:value={selectionPk} />
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<div>State Proof PK:</div>
						<input class="input input-secondary bg-[#00000040]" type="text" bind:value={stateProofPk} />
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<div>Vote PK:</div>
						<input class="input input-secondary bg-[#00000040]" type="text" bind:value={votePk} />
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<div>Vote First:</div>
						<input class="input input-secondary bg-[#00000040]" type="number" bind:value={voteFirst} />
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<div>Vote Last:</div>
						<input class="input input-secondary bg-[#00000040]" type="number" bind:value={voteLast} />
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<div>Vote Key Dilution:</div>
						<input class="input input-secondary bg-[#00000040]" type="number" bind:value={voteKeyDilution} />
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<button
							class="btn btn-ghost bg-[#00000040]"
							onclick={() =>
								registerOnline({ pool, selectionPk, stateProofPk, votePk, voteFirst, voteLast, voteKeyDilution })}
						>
							Register Online
						</button>
					</div>
					<div class="w-full max-w-[610px] flex flex-col justify-center">
						<button class="btn btn-ghost bg-[#00000040]" onclick={() => registerOffline({ pool })}>
							Register Offline
						</button>
					</div>
				</div>
				<div class="br"></div>
			</form>
		</Online>
	{:else}
		<h3>Token Not Found</h3>
	{/if}
</section>

<style>
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
