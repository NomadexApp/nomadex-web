<script lang="ts">
	import { onNumberKeyPress } from '$lib/utils/inputs';

	export let pretext = '';
	export let posttext = '';
	export let value = 0;
	export let decimals = 6;
	export let token: string;
	export let showMax = false;
	export let disabled = false;
	export let handleMax = () => {};

	$: if (value < 0 || (typeof value === 'string' && `${value}`.match(/[-e]/)) || typeof value === 'object') {
		value = 0;
	}
</script>

<div class="field input-field relative">
	{#if pretext}
		<div class="absolute left-4 text-sm text-gray-50 opacity-50"><span>{pretext}</span></div>
	{/if}
	<div class="flex">
		<input
			type="number"
			step={1 / 10 ** decimals}
			bind:value
			{disabled}
			min={0}
			on:keypress={onNumberKeyPress}
			on:keyup
			class="no-arrows"
			placeholder="0"
		/>
		<div class="right">
			<slot name="currency">
				<button class="currency" on:click>
					{token}
					<svg
						width="12"
						height="7"
						viewBox="0 0 12 7"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="SwapCurrencyInputPanel__StyledDropDown-sc-3e2fecea-8 jJfXUM"
						><path d="M0.97168 1L6.20532 6L11.439 1" stroke="currentColor" /></svg
					>
				</button>
			</slot>
		</div>
	</div>
	{#if posttext}
		<div class="absolute bottom-2 left-4 text-sm text-gray-50 opacity-50"><span>{posttext}</span></div>
	{/if}
	{#if showMax}
		<button
			class="absolute bottom-2 right-4 text-sm text-gray-50 opacity-50 cursor-pointer"
			on:click={() => handleMax()}
		>
			<span>MAX</span>
		</button>
	{/if}
</div>

<style>
	.field {
		background: #00000015;
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0.5rem 0;
		padding-right: 1rem;
		border-radius: 8px;
	}

	.field input {
		padding: 1rem;
		width: 100%;
		outline: none;
		background: transparent;
		font-size: 2rem;
	}

	.field .right {
		width: max-content;
		min-width: 5rem;
		display: flex;
		justify-content: end;
		align-items: center;
	}

	.field .right .currency {
		padding: 0.25rem 1rem;
		background: #00000015;
		border-radius: 3rem;
		cursor: pointer;
	}

	.field .right .currency:hover {
		background: #00000050;
	}

	.field .right .currency svg {
		color: white;
	}

	.currency {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}
</style>
