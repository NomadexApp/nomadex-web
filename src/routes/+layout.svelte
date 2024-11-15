<script lang="ts">
	import '../app.scss';
	import '../tailwind.css';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import Modal, { component, modalProps } from '$lib/components/modal/Modal.svelte';
	import Notify from '$lib/components/Notify.svelte';
	import { connectedAccount } from '$lib/components/UseWallet.svelte';
	import { pageContentRefresh, pageContentRefreshPending } from '$lib/utils';
	import '$lib/stores/onchain';
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { arePoolsLoaded, knownTokens, tokensAndPoolsRefresh } from '$lib/index';

	onMount(async () => {
		tokensAndPoolsRefresh();
		setInterval(tokensAndPoolsRefresh, 1000 * 60);
	});

	$: {
		$connectedAccount;
		pageContentRefresh();
	}

	// 5 hours - full cycle
	const cycle = 3600 * 7;
	let clock = 0;
	let zoom = 0;
	function tick() {
		clock = Date.now();
		zoom = 860 + Math.sin(((clock / 3000) % 360) * 0.017453292519943295) * 360;
	}
	tick();
	setInterval(tick, 1000);

	const points = 4;
	$: hueStyle =
		Array(points)
			.fill(0)
			.map((_, i) => `--hue${i + 1}: ${(clock / ((cycle * 1000) / 360) + i * (360 / points)) % 360};`)
			.join('') + `--time: ${cycle}s;--zoom: ${Math.floor(zoom)}%;`;
</script>

{#if browser && $knownTokens.length}
	<section>
		<Navbar />
		<article>
			{#if $arePoolsLoaded}
				<div class="w-full flex flex-col">
					{#if $pageContentRefreshPending}
						<section class="flex flex-col justify-center items-center h-full max-h-[70vh]">
							<span class="loading"></span>
						</section>
					{:else}
						<slot />
					{/if}
				</div>
			{:else}
				<div class="flex h-screen max-h-[70vh] w-full justify-center items-center">
					<span class="loading loading-ring text-primary w-[2.5rem]"></span>
				</div>
			{/if}
		</article>
		<Footer />
		<Notify />
		{#if $component}
			<Modal let:close>
				{#if $component}
					{@const Comp = $component}
					<Comp {close} {...$modalProps} />
				{/if}
			</Modal>
		{/if}
	</section>
{/if}

<div class="page-background second" style={hueStyle}></div>

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
</style>
