<script lang="ts">
	import '../app.scss';
	import '../tailwind.css';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import Modal, { component, props } from '$lib/components/modal/Modal.svelte';
</script>

<section>
	<Navbar />
	<article>
		<slot />
	</article>
	<Footer />
	{#if $component}
		<Modal let:close>
			{#if $component}
				<svelte:component this={$component} {close} {...$props} />
			{/if}
		</Modal>
	{/if}
</section>

<style>
	:global(body) {
		padding-top: 100px;
	}
	article {
		background: #333333;
		width: 100%;
		height: 100%;
		min-height: calc(100vh - 100px);
		margin: 0 auto;
		margin-top: 0;
		display: flex;
		clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% 100%, 0 100%, 0 10px);
		padding: 1rem;
	}
</style>
