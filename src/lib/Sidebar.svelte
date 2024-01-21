<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import UseWallet from './UseWallet.svelte';
	import SwapIcon from 'svelte-star/dist/md/MdAutorenew.svelte';
	import PoolsIcon from 'svelte-star/dist/md/MdFormatListBulleted.svelte';
	import AnalyticsIcon from 'svelte-star/dist/md/MdShowChart.svelte';
	import MdMore from 'svelte-star/dist/md/MdMoreHoriz.svelte';
	import MdMenu from 'svelte-star/dist/md/MdMenu.svelte';
	import { isDarkTheme } from './stores';
	import { onMount } from 'svelte';
	import { knownPools } from '$lib';
	import { pageContentRefresh } from './utils';
	import { page } from '$app/stores';
	import MdToll from 'svelte-star/dist/md/MdToll.svelte';
	import MdAddCircle from 'svelte-star/dist/md/MdToll.svelte';
	import IoMdSwap from 'svelte-star/dist/io/IoMdSwap.svelte';

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
				class="h-32 mx-auto mb-5 cursor-pointer transition-all relative flex justify-center items-center opacity-80"
				on:click={() => goto('/')}
				on:click={() => isMobile && (sidebarOpen = false)}
				on:keydown
			>
				<img class="grayscale" alt="voi logo" src="/logo.png" />
			</div>
			<li class="pl-0" class:is-open={$page.url.pathname.startsWith('/swap/')}>
				<a class="flex justify-between items-center" href={null} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end w-full">SWAP</span>
					<span class="h-5 w-5"><SwapIcon /></span>
				</a>
				<ul class="children">
					{#each $knownPools as pool}
						<li
							class="pl-0 sm:block"
							class:active={$page.url.pathname.startsWith(`/swap/VOI-${pool.arc200Asset.symbol}`) ||
								$page.url.pathname.startsWith(`/swap/${pool.arc200Asset.symbol}-VOI`)}
						>
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
			<li class="pl-0 sm:block" class:active={$page.url.pathname === '/'}>
				<a class="flex justify-between" href="/" on:click={() => isMobile && (sidebarOpen = false)} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end flex-grow w-full">POOLS</span>
					<span class="h-5 w-5"><MdToll /></span>
				</a>
			</li>
			<li class="pl-0 sm:block" class:active={$page.url.pathname.startsWith('/tokens')}>
				<a class="flex justify-between" href="/tokens/" on:click={() => isMobile && (sidebarOpen = false)} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end flex-grow w-full">TOKENS</span>
					<span class="h-5 w-5 block rotate-[135deg]"><MdAddCircle /></span>
				</a>
			</li>
			<li class="pl-0 sm:block" class:active={$page.url.pathname.startsWith('/limit-orders')}>
				<a
					class="flex justify-between"
					href="/limit-orders/"
					on:click={() => isMobile && (sidebarOpen = false)}
					tabindex="0"
				>
					<span class="flex pt-[1px] justify-start items-end flex-grow w-full">LIMIT ORDERS</span>
					<span class="h-5 w-5"><IoMdSwap /></span>
				</a>
			</li>
			<li class="pl-0 sm:block" class:is-open={$page.url.pathname.startsWith('/analytics/')}>
				<a class="flex justify-between" href={null} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end flex-grow w-full">ANALYTICS</span>
					<span class="h-5 w-5"><AnalyticsIcon /></span>
				</a>
				<ul class="children">
					{#each $knownPools as pool}
						<li
							class="pl-0 sm:block"
							class:active={$page.url.pathname.startsWith(`/analytics/VOI-${pool.arc200Asset.symbol}`) ||
								$page.url.pathname.startsWith(`/analytics/${pool.arc200Asset.symbol}-VOI`)}
						>
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
			<!-- <li class="pl-0 sm:block">
				<a class="flex justify-between" href={null} tabindex="0">
					<span class="flex pt-[1px] justify-start items-end flex-grow w-full">More</span>
					<span class="h-5 w-5"><MdMore /></span>
				</a>
				<ul class="children">
					<li
						class="pl-0 sm:block"
						class:active={$page.url.pathname.startsWith(`/tokens/arc200-create`) ||
							$page.url.pathname.startsWith(`/tokens/arc200-create`)}
					>
						<a
							class="flex justify-between"
							href="/tokens/arc200-create"
							on:click={() => {
								isMobile && (sidebarOpen = false);
								pageContentRefresh(0);
							}}
							on:click={() => isMobile && (sidebarOpen = false)}
							tabindex="0"
						>
							<span class="flex pt-[1px] justify-start items-end max-w-[100px]">Create Token</span>
						</a>
					</li>
				</ul>
			</li> -->
			<div class="h-full flex flex-col grow">&nbsp;</div>
			<UseWallet />
		</ul>
	</div>
</div>

<style lang="postcss">
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
		height: 0;
		overflow: hidden;
		transition: height 200ms;
		transition-delay: 100ms;
	}
	li:focus-within > .children,
	li:hover > .children,
	li.is-open > .children {
		height: 120px;
	}
	li.active > a {
		background: var(--fallback-bc, oklch(var(--bc) / 0.1));
		font-weight: bold;
	}
	li.is-open > a {
		font-weight: bold;
	}
</style>
