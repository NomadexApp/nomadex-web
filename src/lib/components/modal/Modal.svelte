<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	export const component = writable<ConstructorOfATypedSvelteComponent | undefined>();
	export const props = writable<Record<string, any> | undefined>();

	export function openModal(comp: ConstructorOfATypedSvelteComponent, props_: Record<string, any>) {
		props.set(props_);
		component.set(comp);
	}
</script>

<script lang="ts">
	export let open = true;

	function close() {
		open = false;
		component.set(undefined);
		props.set(undefined);
	}
</script>

<dialog {open}>
	<slot {close} />
</dialog>
<div on:keydown class="overlay" on:click={close} />

<style>
	dialog {
		position: fixed;
		margin: 0;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #222211;
		border-radius: 8px;
		min-width: 400px;
		width: max-content;
		max-width: 99vw;
		padding: 1rem;
		box-shadow: 0px 0px 2px #000;
		min-height: 100px;
		z-index: 1001;
	}
	dialog[open] + .overlay {
		content: 'a';
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #44444455;
		z-index: 1000;
	}
</style>
