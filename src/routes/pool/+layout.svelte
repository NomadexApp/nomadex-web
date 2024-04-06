<script lang="ts">
	import { getStores } from '$app/stores';
	import ActionButton from '$lib/components/form/ActionButton.svelte';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';

	const { page } = getStores();
</script>

<form>
	<FormTitle>Liquidity Pools</FormTitle>
	<p>
		Liquidity providers earn a fee on all trades proportional to their share of the pool. Fees are added to the pool,
		accrue in real time and can be claimed by removing your liquidity.
	</p>
	<br />

	<div class="join grid grid-cols-2">
		<a
			href="/pool"
			class="join-item btn hover:outline-none btn-outline text-[#ffffdd] hover:bg-[#ffff66]"
			class:active={$page.url.pathname.match(/\/pool\/?$/)}>Pools</a
		>
		<a
			href="/pool/your-positions"
			class="join-item btn hover:outline-none btn-outline text-[#ffffdd] hover:bg-[#ffff66]"
			class:active={$page.url.pathname.match(/\/pool\/your-positions\/?/)}>Your Positions</a
		>
	</div>
	<br />

	{#if $page.url.pathname.match(/\/pool\/?$/)}
		<h3 class="text-xl mb-2">Search pool</h3>
		<TextInput placeholder="Search name or paste id" />
		<br />
		<h3 class="text-xl mb-2">Popular pools</h3>
	{/if}

	<div class="pools mb-8 text-base">
		<div class="pools-head mb-2 text-sm justify-between bg-[#ffff6605] hover:bg-[#ffff6611] rounded p-2 cursor-pointer">
			<th class="flex-grow-[1.2]"> Name </th>
			<th class="flex-grow"> TVL </th>
			<th class="flex-grow"> APR </th>
			<th class="flex-grow"> &nbsp; </th>
		</div>
		{#each Array(7).fill(0) as i}
			<tr class="pool mb-2 justify-between bg-[#ffff6605] hover:bg-[#ffff6611] rounded p-2 cursor-pointer">
				<td class="flex gap-2">
					<div class="icon avatar w-7 h-7 bg-[#666633] rounded-full flex justify-center items-center">?</div>
					<div class="ml-[-1rem] icon avatar w-7 h-7 bg-[#666633] rounded-full flex justify-center items-center">?</div>
					<div class="flex flex-col justify-center">
						<span class="name">VOI <span class="text-gray-500">/</span> VIA</span>
					</div>
				</td>
				<td>10 VOI</td>
				<td>10%</td>
				<td>
					<button class="btn btn-sm bg-[#222211]">Add Liq</button>
				</td>
			</tr>
		{/each}
	</div>
</form>
<br />

<slot />

<!-- <div class="buttons">
	<ActionButton on:click={() => close()}>Close</ActionButton>
</div> -->

<style>
	form {
		margin: 0 auto;
		margin-top: 50px;
		width: 700px;
	}
	td {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.pools {
		display: flex;
		flex-direction: column;
	}

	.pools-head {
		display: flex;
		justify-content: space-between;
	}

	.pool {
		display: flex;
		justify-content: space-between;
	}
	.join-item.active {
		color: #000000;
		background: #ffff66;
	}
</style>
