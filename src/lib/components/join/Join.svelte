<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: {
		id: string;
		name: string;
		href: string;
		'data-sveltekit-noscroll'?: true;
	}[];
	export let active: string;

	const dispatch = createEventDispatcher();
</script>

<div class="join sm:grid sm:grid-cols-2">
	{#each items as item}
		{@const { id, name, href, ...rest } = item}
		<a
			{href}
			{...rest}
			class="join-item btn hover:outline-none btn-outline text-[#ffffdd] hover:bg-primary hover:text-black"
			class:active={id === active}
			on:click={() => dispatch('select', item)}
		>
			{name}
		</a>
	{/each}
</div>

<style>
	a.active,
	a:hover {
		border: 1px solid var(--color-primary);
	}
	.join-item.active {
		color: #000000;
		background: var(--color-primary);
	}
</style>
