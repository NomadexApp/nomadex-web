<script lang="ts">
	import { browser } from '$app/environment';
	import Logo from '$lib/Logo.svelte';

	let scrollY = 0;

	$: fullScroll = Boolean(browser && scrollY + window.innerHeight > document.body.scrollHeight - 100);
</script>

<svelte:window bind:scrollY on:scroll|preventDefault />

<footer class="flex-col sm:flex-row" class:scrolled={fullScroll}>
	<div class="flex justify-start gap-4">
		<div class="w-10">
			<Logo />
		</div>
		<div>
			<h2 class="text-lg font-normal">Nomadex</h2>
			<h3 class="text-gray-400">Decentralized Exchange</h3>
		</div>
	</div>
	<div class="flex justify-between w-screen max-w-[280px] px-4">
		<div class="">
			<h3 class="mb-2">App</h3>
			<ul class="font-thin text-gray-400">
				<li>
					<a href="/swap/VOI-VIA">Swap</a>
				</li>
				<li>
					<a href="/pools">Liquidity Pools</a>
				</li>
				<li>
					<a href="/limit/VIA/buy">Limit Orders</a>
				</li>
				<li>
					<a href="/analytics/VIA">Analytics</a>
				</li>
			</ul>
		</div>
		<div class="">
			<h3 class="mb-2">Links</h3>
			<ul class="font-thin text-gray-400">
				<li><a target="_blank" href="//twitter.com/nomadex_app">Twitter</a></li>
				<li><a target="_blank" href="//">Discord</a></li>
				<li><a target="_blank" href="//github.com/webdevalgo">Github</a></li>
			</ul>
		</div>
	</div>
</footer>

<style>
	footer {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		background: #222222;
		color: #f0f0f0;
		width: 100%;
		min-height: 200px;
		padding: 2rem 2rem;
		gap: 2rem;
	}
	/* footer.scrolled::after {
		content: '';
		background: #222222;
		position: fixed;
		z-index: -8;
		height: 25vh;
		left: 0;
		right: 0;
		bottom: 0;
	} */
</style>
