<script lang="ts">
	import { goto } from '$app/navigation';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';

	$: if (!$connectedAccount) {
		goto('/pool');
	}
</script>
