<script lang="ts">
	import ActionButton from '../form/ActionButton.svelte';
	import TextInput from '../form/TextInput.svelte';

	export let close: Function;
</script>

<form>
	<h3 class="mb-2">Select a token</h3>
	<TextInput placeholder="Search name or paste id" />
	<br>
	<span class="block mb-2">Popular tokens</span>
	<div class="tokens flex flex-col gap-2 mb-4">
		{#each Array(7).fill(0) as i}
			<div class="token flex gap-4 bg-[#ffff6605] hover:bg-[#ffff6611] rounded p-2 cursor-pointer">
				<div class="icon avatar w-10 h-10 bg-[#666633] rounded-full flex justify-center items-center" >
					?
				</div>
				<div class="flex flex-col text-sm">
					<span class="name">Voi Incentive Asset</span>
					<span class="symbol text-gray-200">VIA</span>
				</div>
			</div>
		{/each}
	</div>
</form>

<div class="buttons">
	<ActionButton on:click={() => close()}>Close</ActionButton>
</div>


<style>
	form {
		width: min(350px, calc(100vw - 5rem));
		max-width: 400px;
		overflow: hidden;
	}
	.tokens {
		display: flex;
		flex-direction: column;

	}

	.token {
		display: flex;
	}
</style>