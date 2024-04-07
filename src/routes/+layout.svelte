<script lang="ts">
	import '../app.scss';
	import '../tailwind.css';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import Modal, { component, props } from '$lib/components/modal/Modal.svelte';
	import Notify from '$lib/Notify.svelte';
	import { connectedAccount, getKibisisClient, isKibisisInstalled, walletConnect } from '$lib/UseWallet.svelte';
	import { pageContentRefreshPending } from '$lib/utils';
	import QRCodeIcon from 'svelte-star/dist/io/IoMdQrScanner.svelte';
	import '$lib/stores/onchain';
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import '$lib/firebase';
	import { arePoolsLoaded, getListOfArc200Tokens } from '$lib/index';
	import { page } from '$app/stores';

	onMount(() => {
		try {
			getKibisisClient();
		} catch (e) {
			//
		}
		getListOfArc200Tokens();
	});
</script>

{#if browser}
	<section>
		<Navbar />
		<article>
			{#if $arePoolsLoaded}
				<!-- <Sidebar /> -->
				<div class="w-full flex flex-col">
					{#if $connectedAccount || $page.url.pathname.startsWith('/analytics/') || $page.url.pathname.startsWith('/accounts')}
						{#if $pageContentRefreshPending}
							<section class="flex flex-col justify-center items-center h-full max-h-[95vh]">
								<span class="loading" />
							</section>
						{:else}
							<slot />
						{/if}
					{/if}
				</div>
				<Notify />
			{:else}
				<div class="flex h-screen w-full justify-center items-center">
					<span class="loading loading-ring text-primary w-[2.5rem]" />
				</div>
			{/if}
		</article>
		<Footer />
		{#if $component}
			<Modal let:close>
				{#if $component}
					<svelte:component this={$component} {close} {...$props} />
				{/if}
			</Modal>
		{/if}
	</section>
{/if}

<style>
	:global(body) {
		padding-top: 100px;
	}
	article {
		background: #333333;
		width: 100%;
		height: 100%;
		min-height: calc(100vh - 100px);
		margin: 0 auto;
		margin-top: 0;
		display: flex;
		/* clip-path: polygon(15px 0%, calc(100% - 15px) 0%, 100% 25%, 100% 100%, 0 100%, 0 25%); */
		padding: 1rem;
	}
</style>
