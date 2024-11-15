<script lang="ts">
	import { goto } from '$app/navigation';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';

	let {} = $props();

	$effect(() => {
		if (!$connectedAccount) {
			goto('/pool');
		}
	});
</script>
