<script lang="ts">
	import { getStores } from '$app/stores';
	import { knownPools, popularPools, type Pool } from '$lib';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Join from '$lib/components/join/Join.svelte';

	const { page } = getStores();

	let searchText = '';

	import PoolInfo from '$lib/PoolInfo.svelte';
	import { OnChainStateWatcher, type AccountState } from '$lib/stores/onchain';
	import { connectedAccount } from '$lib/UseWallet.svelte';
	import { Arc200Interface } from '$lib/utils';
	import algosdk from 'algosdk';

	let poolBalances: { [k: string]: { algo: number; arc200: bigint; lpt: bigint } } = {};

	async function fetchBalances(pool: Pool) {
		if (poolBalances[pool.poolId]) return poolBalances[pool.poolId];

		const poolState = <AccountState>(
			await OnChainStateWatcher.getAccountState(algosdk.getApplicationAddress(pool.poolId))
		);
		const poolArc200Balance = await Arc200Interface.arc200_balanceOf(
			pool.arc200Asset.assetId,
			algosdk.getApplicationAddress(pool.poolId)
		);
		const lptBalance = await Arc200Interface.arc200_totalSupply(pool.poolId);
		poolBalances = {
			...poolBalances,
			[pool.poolId]: {
				algo: poolState.amount,
				arc200: poolArc200Balance,
				lpt: lptBalance,
			},
		};
	}

	$: my = Boolean($page.url.pathname.match('/your-positions'));
	$: all = Boolean($page.url.pathname.match('/pool/all'));

	$: filteredPools = searchText
		? $knownPools.filter(
				(pool) =>
					pool.arc200Asset.symbol.toLowerCase().match(searchText.toLowerCase()) ||
					pool.arc200Asset.assetId.toString() === searchText ||
					pool.poolId.toString() === searchText
		  )
		: $knownPools
				.filter((pool) => (popularPools.length && !my && !all ? popularPools.includes(pool.arc200Asset.symbol) : true))
				.sort((a, b) => popularPools.indexOf(a.arc200Asset.symbol) - popularPools.indexOf(b.arc200Asset.symbol));

	$: {
		for (const pool of filteredPools) {
			fetchBalances(pool);
		}
	}
</script>

<form class="max-w-[90vw] overflow-hidden">
	<FormTitle>Liquidity Pools</FormTitle>
	{#if !all}
		<p>
			Liquidity providers earn a fee on all trades proportional to their share of the pool. Fees are added to the pool,
			accrue in real time and can be claimed by removing your liquidity.
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
			<div>APR</div>
			<div>&nbsp;</div>
		</div>

		{#each filteredPools.sort((pool, pool1) => poolBalances[pool1.poolId]?.algo - poolBalances[pool.poolId]?.algo) as pool (pool.poolId)}
			<PoolInfo
				pool={{ ...pool, balances: poolBalances[pool.poolId] ?? { algo: 0, arc200: 0, lpt: 0 } }}
				{my}
				checkForLpt={Boolean($page.url.pathname.match(/\/pool\/your-positions$/))}
			/>
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
