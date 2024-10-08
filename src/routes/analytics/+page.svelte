<script>
	import { goto } from '$app/navigation';
	import { knownPools } from '$lib';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(`/analytics/${$knownPools?.[0]?.id ?? 0}`);
	});
</script>
