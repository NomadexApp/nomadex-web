<script lang="ts">
	import type { Pool } from '$lib';
	import Arb from './Arb.svelte';

	type ArbNode = {
		pool: Pool;
		fromAsset: number;
		children: ArbNode[];
	};
	let { node }: { node: ArbNode } = $props();

	let fromAsset = $derived(node.pool.assets[node.fromAsset]);
	let toAsset = $derived(node.pool.assets[(node.fromAsset + 1) % 2]);
</script>

<div>
	{fromAsset.symbol}
	{#each node.children as child}
		<Arb node={child} />
	{/each}
</div>

<style>
    div {
        padding-left: 1rem;
    }
</style>