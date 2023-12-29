<script lang="ts">
	import PendingTxns from '$lib/PendingTxns.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import { connectedAccount, walletConnect } from '$lib/UseWallet.svelte';
	import '../app.css';
</script>

<div class="hidden md:flex">
	<Sidebar />
	<div class="w-full flex flex-col">
		{#if $connectedAccount}
			<slot />
			<PendingTxns />
		{:else}
			<section class="flex justify-center items-center h-full">
				<button class="btn" on:click={() => walletConnect()}>Connect To Wallet</button>
			</section>
		{/if}
	</div>
</div>
<div class="md:hidden flex w-[calc(100vw)] h-[calc(100vh)] justify-center items-center">
	This screen size not supported for now
</div>
