<script lang="ts">
	import { page } from '$app/stores';
	import { knownPools } from '$lib';
	import { indexerClient, nodeClient } from '$lib/_shared';
	import algosdk from 'algosdk';

	let appId = $state(Number($page.params.tokenId));
	let holders: { address: string; amount: number; note: string }[] = $state([]);
	let stats: Record<string, number[]> = $state({});
	let unit = $state(1);
	let loading = $state(false);

	async function load() {
		loading = true;
		const info = await nodeClient.getAssetByID(appId).do();
		unit = 10 ** info.params.decimals;
		const olders = await indexerClient.lookupAssetBalances(appId).do();
		const poolAddresses = $knownPools.map((p) => algosdk.getApplicationAddress(p.poolId));
		holders = olders.balances
			.filter((a) => a.amount)
			.sort((a, b) => b.amount - a.amount)
			.map((bal) => ({
				...bal,
				note: info.params.reserve === bal.address ? 'Reserve' : poolAddresses.includes(bal.address) ? 'Pool' : 'Holder',
			}));
		stats = holders.reduce(
			(acc, bal) => ({
				...acc,
				[bal.note]: acc[bal.note] ? [...acc[bal.note], bal.amount] : [bal.amount],
			}),
			{}
		);
		loading = false;
	}

	$effect.root(() => {
		load();
	});
</script>

<section class="pt-12 p-4 h-full flex flex-row justify-evenly items-center gap-3">
	{#if loading}
		<section class="flex flex-col justify-center items-center h-full max-h-[70vh]">
			<span class="loading"></span>
		</section>
	{:else}
		<div class="h-full flex flex-col justify-start items-center gap-3 w-full font-mono">
			<div class="flex justify-between max-w-[610px] w-full">
				{#each Object.entries(stats) as [note, amounts]}
					<div class="">
						<div>{note}</div>
						<div class="flex gap-2">
							<div>{Math.floor((100 * amounts.reduce((acc, n) => acc + n, 0)) / unit) / 100}</div>
						</div>
					</div>
				{/each}
			</div>

			{#each holders as holder}
				<div class="w-full max-w-[610px] flex justify-between">
					<a href="https://block.voi.network/explorer/account/{holder.address}" target="_blank">
						{holder.address.slice(0, 12)}...{holder.address.slice(-12)}
						{#if holder.note !== 'Holder'}
							<span>{holder.note}</span>
						{/if}
					</a>
					<div class="flex gap-2">
						<div>{Math.floor((holder.amount * 1e6) / unit) / 1e6}</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
</style>
