<script lang="ts">
	import { pendingTxn } from './UseWallet.svelte';
</script>

<div class="fixed top-10 right-10">
	<span class:loading={$pendingTxn} class="bg-primary loading-lg" />
</div>
