<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import UseWallet from './UseWallet.svelte';
	import SwapIcon from 'svelte-star/dist/md/MdAutorenew.svelte';
	import PoolsIcon from 'svelte-star/dist/md/MdFormatListBulleted.svelte';
	import AnalyticsIcon from 'svelte-star/dist/md/MdShowChart.svelte';
	import MdMenu from 'svelte-star/dist/md/MdMenu.svelte';
	import { isDarkTheme } from './stores';
	import { onMount } from 'svelte';
	import { knownPools } from '$lib';
	import { pageContentRefresh } from './utils';
	import { page } from '$app/stores';

	let sidebarWidth = 0;
	let innerWidth = browser ? window.innerWidth : 0;
	let isMobile = innerWidth < 700;

	$: isMobile = innerWidth < 700;

	let sidebarOpen = browser ? (isMobile ? false : JSON.parse(localStorage.getItem('sidebar_open') ?? 'true')) : true;
	$: browser && localStorage.setItem('sidebar_open', sidebarOpen);

	let scrollY = 0;
	let init = false;

	onMount(() => {
		setTimeout(() => {
			init = true;
		});
	});
</script>

<svelte:window bind:scrollY bind:innerWidth />

<div
	class="sidebar drawer drawer-open max-w-min absolute md:relative bg-black"
	class:init
	bind:clientWidth={sidebarWidth}
	style="margin-left: -{sidebarOpen ? 0 : sidebarWidth}px;"
>
	<input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={sidebarOpen} />
	<div class="drawer-content" />
	<label
		for="my-drawer"
		class="switch-drawer bg-base-300 border-none drawer-button flex"
		style="opacity: {(window.innerHeight * 0.5 - scrollY) / (window.innerHeight * 0.5)};"
		class:theme-dark={$isDarkTheme}
		class:open={sidebarOpen}
	>
		<span class="w-5 text-base-content scale-125 rotate-90"> <MdMenu /></span>
	</label>
	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu p-4 w-72 min-h-full bg-base-300 text-base-content">
			<div
				class="h-32 mx-auto mb-5 cursor-pointer transition-all relative flex justify-center items-center animate-pulse"
				on:click={() => goto('/')}
				on:click={() => isMobile && (sidebarOpen = false)}
				on:keydown
			>
				<img class="grayscale" alt="voi logo" src="/logo.png" />
			</div>
			<li class="pl-0" class:is-open={$page.url.pathname.startsWith('/swap/')}>
				<a class="flex justify-between items-center" href={null} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end max-w-[100px]">SWAP</span>
					<span class="h-5"><SwapIcon /></span>
				</a>
				<ul class="children">
					{#each knownPools as pool}
						<li class="pl-0 sm:block">
							<a
								class="flex justify-between"
								href="/swap/VOI-{pool.arc200Asset.symbol}"
								on:click={() => {
									isMobile && (sidebarOpen = false);
									pageContentRefresh(0);
								}}
								on:click={() => isMobile && (sidebarOpen = false)}
								tabindex="0"
							>
								<span class="flex pt-[1px] justify-start items-end max-w-[100px]">VOI-{pool.arc200Asset.symbol}</span>
							</a>
						</li>
					{/each}
				</ul>
			</li>
			<li class="pl-0 sm:block">
				<a class="flex justify-between" href="/pools" on:click={() => isMobile && (sidebarOpen = false)} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end max-w-[100px]">POOLS</span>
					<span class="h-5"><PoolsIcon /></span>
				</a>
			</li>
			<li class="pl-0 sm:block" class:is-open={$page.url.pathname.startsWith('/analytics/')}>
				<a class="flex justify-between" href={null} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end max-w-[100px]">ANALYTICS</span>
					<span class="h-5"><AnalyticsIcon /></span>
				</a>
				<ul class="children">
					{#each knownPools as pool}
						<li class="pl-0 sm:block">
							<a
								class="flex justify-between"
								href="/analytics/VOI-{pool.arc200Asset.symbol}"
								on:click={() => {
									isMobile && (sidebarOpen = false);
									pageContentRefresh(0);
								}}
								on:click={() => isMobile && (sidebarOpen = false)}
								tabindex="0"
							>
								<span class="flex pt-[1px] justify-start items-end max-w-[100px]">VOI-{pool.arc200Asset.symbol}</span>
							</a>
						</li>
					{/each}
				</ul>
			</li>
			<div class="h-full flex flex-col grow">&nbsp;</div>
			<UseWallet />
		</ul>
	</div>
</div>

<style lang="postcss">
	@keyframes pulse {
		0% {
			opacity: 0.7;
		}
		50% {
			opacity: 0.8;
		}
		100% {
			opacity: 0.7;
		}
	}
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.sidebar {
		z-index: 10000;
	}
	.sidebar.init {
		transition: margin-left 400ms ease-in-out;
	}

	.switch-drawer {
		width: 2rem;
		height: 6rem;
		position: absolute;
		top: calc(50vh - 3rem);
		left: 18rem;
		border-top-right-radius: 1rem;
		border-bottom-right-radius: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		@apply text-base-content;
	}

	li > .children {
		display: none;
	}
	li:focus-within > .children,
	li.is-open > .children {
		display: block;
		animation: fadein 800ms forwards;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
