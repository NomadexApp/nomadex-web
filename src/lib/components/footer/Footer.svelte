<script lang="ts">
	import { browser } from '$app/environment';

	let scrollY = 0;

	$: fullScroll = Boolean(browser && scrollY + window.innerHeight > document.body.scrollHeight - 100);
</script>

<svelte:window bind:scrollY on:scroll|preventDefault />

<footer class="h-[50vh] md:h-[50vh]" class:scrolled={fullScroll}>
	<h2 class="text-xs lg:text-xl">Nomadex | Decentralized Exchange</h2>
</footer>

<style>
	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #222222;
		color: #f0f0f0;
		width: 100%;
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
