<script>
	import { goto } from '$app/navigation';
	import { knownPools } from '$lib';
	import { onMount } from 'svelte';

	let {} = $props();

	onMount(() => {
		goto(`/analytics/${$knownPools?.[0]?.id ?? 0}`);
	});
</script>
