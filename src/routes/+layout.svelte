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
	import { arePoolsLoaded, knownTokens, tokensAndPoolsRefresh } from '$lib/index';

	onMount(async () => {
		tokensAndPoolsRefresh();
		setInterval(tokensAndPoolsRefresh, 1000 * 60);
	});

	$: {
		$connectedAccount;
		pageContentRefresh();
	}

	let clock = Date.now();
	setInterval(() => {
		clock = Date.now();
	}, 1000);

	const cycle = 3600;
	$: hueStyle =
		Array(4)
			.fill(0)
			.map((_, i) => `--hue${i + 1}: ${(clock / (cycle * 2.777777777777) + i * 90) % 360};`)
			.join('') + `--time: ${cycle}s;--zoom:${500 + (Math.floor(clock / 12000) % 500)}%;`;
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
					<Comp {close} {...$props} />
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
