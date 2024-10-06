<script lang="ts">
	import '../app.scss';
	import '../tailwind.css';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import Modal, { component, props } from '$lib/components/modal/Modal.svelte';
	import Notify from '$lib/components/Notify.svelte';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { pageContentRefresh, pageContentRefreshPending } from '$lib/utils';
	import '$lib/stores/onchain';
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { arePoolsLoaded, getListOfArc200Tokens, knownTokens } from '$lib/index';
	import Logo from '$lib/components/Logo.svelte';

	onMount(async () => {
		getListOfArc200Tokens();
	});

	$: {
		$connectedAccount;
		pageContentRefresh();
	}

	let hue = Math.floor(Date.now() / 1000) % 360;
	function nextHue(hue: number, x: number) {
		return (hue + 45 * x) % 360;
	}

	$: hueStyle = `
		--hue1: ${nextHue(hue, 0)};
		--hue2: ${nextHue(hue, 1)};
		--hue3: ${nextHue(hue, 2)};
		--hue4: ${nextHue(hue, 3)};
		--hue5: ${nextHue(hue, 4)};
		--hue6: ${nextHue(hue, 5)};
		--hue7: ${nextHue(hue, 6)};
		--hue8: ${nextHue(hue, 7)};
	`;
</script>

{#if browser && $knownTokens.length}
	<section>
		<Navbar />
		<article>
			{#if $arePoolsLoaded}
				<div class="w-full flex flex-col">
					{#if $pageContentRefreshPending}
						<section class="flex flex-col justify-center items-center h-full max-h-[70vh]">
							<span class="loading" />
						</section>
					{:else}
						<slot />
					{/if}
				</div>
			{:else}
				<div class="flex h-screen max-h-[70vh] w-full justify-center items-center">
					<span class="loading loading-ring text-primary w-[2.5rem]" />
				</div>
			{/if}
		</article>
		<Footer />
		<Notify />
		{#if $component}
			<Modal let:close>
				{#if $component}
					<svelte:component this={$component} {close} {...$props} />
				{/if}
			</Modal>
		{/if}
	</section>
{/if}

<div class="page-background second" style={hueStyle} />

<style>
	:global(body) {
		padding-top: 100px;
	}
	section {
		color: white;
	}
	article {
		/* max-width: 1280px; */
		/* backdrop-filter: blur(10px); */
		width: 100%;
		height: 100%;
		min-height: calc(100vh - 100px);
		margin: 0 auto;
		margin-top: 0;
		display: flex;
		/* clip-path: polygon(15px 0%, calc(100% - 15px) 0%, 100% 25%, 100% 100%, 0 100%, 0 25%); */
		padding: 1rem;
	}
	.testnet-overlay {
		position: fixed;
		background: black;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
