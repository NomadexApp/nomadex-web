<script lang="ts">
	import { goto } from '$app/navigation';
	import UseWallet from './UseWallet.svelte';
	import SwapIcon from 'svelte-star/dist/md/MdAutorenew.svelte';
	import PoolsIcon from 'svelte-star/dist/md/MdFormatListBulleted.svelte';
</script>

<div class="drawer drawer-open max-w-min">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content" />
	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu p-4 w-72 min-h-full bg-base-300 text-base-content">
			<div
				class="h-32 mx-auto mb-5 cursor-pointer transition-all relative flex justify-center items-center animate-pulse"
				on:click={() => goto('/')}
				on:keydown
			>
				<img class="grayscale" alt="voi logo" src="/logo.png" />
			</div>
			<li class="pl-0">
				<a class="flex justify-between items-center" href="/swap" tabindex="0">
					<span class="flex pt-[1px] justify-start items-end max-w-[100px]">SWAP</span>
					<span class="h-5"><SwapIcon /></span>
				</a>
			</li>
			<li class="pl-0">
				<a class="flex justify-between" href="/pools" tabindex="0">
					<span class="flex pt-[1px] justify-start items-end max-w-[100px]">POOLS</span>
					<span class="h-5"><PoolsIcon /></span>
				</a>
			</li>
			<div class="h-full flex flex-col grow">&nbsp;</div>
			<UseWallet />
		</ul>
	</div>
</div>

<style>
	@keyframes pulse {
		50% {
			opacity: 0.9;
		}
	}
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
