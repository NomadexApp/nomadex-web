<script lang="ts">
	import { goto } from '$app/navigation';
	import UseWallet from './UseWallet.svelte';
	import { currentAppId } from './_deployed';
	import { deployVoiSwap } from './_shared';

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
		<ul class="menu p-4 w-72 min-h-full bg-base-200 text-base-content text-lg">
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
				<a class="flex justify-between" href="/swap" tabindex="0">
					<span class="flex pt-[1px] justify-start items-end max-w-[100px]">Swap</span>
					<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22">
						<path
							fill="currentColor"
							d="M482-160q-134 0-228-93t-94-227v-7l-64 64-56-56 160-160 160 160-56 56-64-64v7q0 100 70.5 170T482-160q26 0 51-6t49-18l60 60q-38 22-78 33t-82 11Zm278-161L600-481l56-56 64 64v-7q0-100-70.5-170T478-720q-26 0-51 6t-49 18l-60-60q38-22 78-33t82-11q134 0 228 93t94 227v7l64-64 56 56-160 160Z"
						/>
					</svg>
				</a>
			</li>
			<li class="pl-0">
				<a class="flex justify-between" href="/pools" tabindex="0">
					<span class="flex pt-[1px] justify-start items-end max-w-[100px]">Pools</span>
					<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22">
						<path
							fill="currentColor"
							d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"
						/>
					</svg>
				</a>
			</li>
			<div class="h-full flex flex-col grow">&nbsp;</div>
			<UseWallet />
		</ul>
	</div>
</div>
