<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let scrollY = 0;
	let innerHeight = 0;
	let pageHeight = 0;

	$: fullScroll = Boolean(browser && scrollY + innerHeight > document.body.scrollHeight - 10);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<footer class="h-[300px] md:h-[300px]" class:scrolled={fullScroll}>
	<h2 class="text-xs lg:text-xl">Nomadex | Decentralized Exchange</h2>
</footer>

<style>
	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #222222;
		color: white;
		width: 100%;
	}
	footer.scrolled::after {
		content: '';
		background: #222222;
		position: fixed;
		z-index: -8;
        height: 300px;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
