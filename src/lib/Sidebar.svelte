<script lang="ts">
	import { goto } from '$app/navigation';
	import UseWallet from './UseWallet.svelte';
	import { currentAppId } from './_deployed';
	import { deployVoiSwap } from './_shared';
	import SwapIcon from 'svelte-star/dist/md/MdAutorenew.svelte';
	import PoolsIcon from 'svelte-star/dist/md/MdFormatListBulleted.svelte';

	async function updateContract(event: MouseEvent) {
		event.preventDefault();
		const appId = await deployVoiSwap(currentAppId);
		console.log('Updated:', { appId });
	}
</script>

<div class="drawer drawer-open max-w-min">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content" />
	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu p-4 w-72 min-h-full bg-base-200 text-base-content">
			<div class="cursor-pointer transition-all relative" on:click={() => goto('/')} on:keydown>
				<img class="mask mask-triangle-2 opacity-80" alt="voi logo" src="/favicon.png" />
				<img
					class="absolute top-0 opacity-10 hover:opacity-100 transition-opacity duration-1000"
					alt="voi logo"
					src="/favicon.png"
				/>
			</div>
			<br />
			<br />
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
