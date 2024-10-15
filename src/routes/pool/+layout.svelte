<script lang="ts">
	import { getStores } from '$app/stores';
	import { PUBLIC_NETWORK } from '$env/static/public';
	import { knownPools, type Pool } from '$lib';
	// import { getPoolBalances } from '$lib/_shared';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Join from '$lib/components/join/Join.svelte';

	const { page } = getStores();

	let searchText = '';

	import PoolInfo from '$lib/components/PoolInfo.svelte';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';

	import { onMount } from 'svelte';

	let poolBalances: { [k: string]: { alpha: bigint; beta: bigint; lpt: bigint; issuedLpt: bigint } };

	onMount(async () => {
		// const response = await getPoolBalances($connectedAccount);
		// balances = response.balances;
	});

	async function fetchBalances() {
		if (!$connectedAccount) return;
		const response = await fetch(`https://${PUBLIC_NETWORK}-analytics.nomadex.app/pools/${$connectedAccount}`);
		const jsonResponse = await response.json();
		poolBalances = {};
		for (const pool of jsonResponse) {
			const issuedLpt = BigInt(pool.balance.issuedLpt);
			const lpt = BigInt(pool.balance.lpt);
			poolBalances[pool.id] = {
				alpha: (BigInt(pool.balance.alpha) * lpt) / issuedLpt,
				beta: (BigInt(pool.balance.beta) * lpt) / issuedLpt,
				lpt: lpt,
				issuedLpt: issuedLpt,
			};
		}
		poolBalances = poolBalances;
	}

	$: my = Boolean($page.url.pathname.match('/your-positions'));
	$: all = Boolean($page.url.pathname.match('/pool/all'));

	$: if (my) fetchBalances();

	function filterPools(searchText: string, my: boolean, pools: Pool[], _: any) {
		if (my) return pools.filter((p) => poolBalances?.[p.poolId]);
		if (searchText) {
			return pools.filter((p) => {
				const asset = p.assets.find((a) => a.symbol.toLowerCase().match(searchText.toLowerCase()) || a.id.toString() === searchText) || p.poolId.toString() === searchText;
				return asset;
			});
		}
		return pools.slice(0, 10);
	}

	$: filteredPools = filterPools(searchText, my, $knownPools, poolBalances);
</script>

{#if !$page.params.poolId}
	<form class="max-w-[90vw] overflow-hidden">
		<div class="flex justify-between items-center">
			<FormTitle>Liquidity Pools</FormTitle>
			<div>
				<a href="/pools/create" class="btn btn-ghost">Create Pool</a>
			</div>
		</div>
		{#if !all}
			<p>
				Liquidity providers earn a fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by removing your
				liquidity.
			</p>
			<div class="br" />

			{#if $connectedAccount}
				<Join
					items={[
						{ id: 'pools', name: 'Pools', href: '/pool' },
						{ id: 'your-positions', name: 'Your Positions', href: '/pool/your-positions' },
					]}
					active={$page.url.pathname.match(/\/pool\/your-positions\/?/) ? 'your-positions' : 'pools'}
				/>
				<div class="br" />
			{/if}
		{:else}
			<div class="br" />
		{/if}
		<br class="sm:hidden" />

		{#if $page.url.pathname.match(/\/pool\/?$/)}
			<h3 class="text-xl mb-2">Search pool</h3>
			<TextInput placeholder="Search by name or id" bind:value={searchText} />
			<div class="br" />
			<h3 class="text-xl mb-2">Popular pools</h3>
		{/if}

		<div class="pools mb-8 text-base sm:bg-[#00000033] sm:rounded-[8px] flex flex-col gap-2">
			<div class="pool hidden sm:grid">
				<div>Name</div>
				<div>{my ? 'Value' : 'TVL'}</div>
				<div class="inline-flex items-start">VOL<span class="text-xs -mt-1 text-gray-300">7d</span></div>
				<div>APY</div>
				<div>&nbsp;</div>
			</div>

			{#each filteredPools as pool (pool.poolId)}
				<PoolInfo {pool} {my} balances={poolBalances?.[pool.poolId]} />
			{:else}
				{#if !poolBalances}
					<div class="w-full flex justify-center p-4 pb-8">
						<span class="loading" />
					</div>
				{/if}
			{/each}
		</div>
	</form>
	{#if !my && !all}
		<div class="flex justify-center">
			<a href="/pool/all"><button class="btn btn-ghost">All Pools</button></a>
		</div>
	{/if}
	<div class="br" />
	<div class="br" />
	<div class="br" />
	<div class="br" />
	<div class="br" />
{/if}

<slot />

<style>
	form {
		margin: 0 auto;
		margin-top: 50px;
		width: 800px;
	}

	.pools {
		backdrop-filter: blur(5px);
	}

	.pools > :global(.pool) {
		grid-template-columns: minmax(100px, 1fr) minmax(50px, 150px) minmax(50px, 150px) minmax(50px, 75px) 120px;
		padding: 0.5rem;
	}

	.pools > :global(.pool) > :global(*) {
		padding: 0.5rem;
	}
</style>
