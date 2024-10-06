<script>
	import { goto } from '$app/navigation';
	import { knownPools } from '$lib';
	import { onMount } from 'svelte';

	onMount(() => {
		const [tokenA, tokenB] = $knownPools[0].assets;
		goto(`/${tokenA.type}/${tokenA.id}/${tokenB.type}/${tokenB.id}`);
	});
</script>
