<script lang="ts" module>
	export function readableNumber(number: number): string {
		if (number < 1000) {
			return Number(number.toFixed(2)).toString();
		} else if (number < 1000000) {
			return (number / 1000).toFixed(1) + 'k';
		} else if (number < 1000000000) {
			return (number / 1000000).toFixed(1) + 'm';
		} else {
			return (number / 1000000000).toFixed(1) + 'b';
		}
	}
</script>

<script lang="ts">
	let { amount = 0 } = $props();
</script>

{#if amount < 0.1}
	{Number(amount.toFixed(5))}
{:else if amount < 10}
	{Number(amount.toFixed(5)).toLocaleString()}
{:else if amount < 10_000}
	{Math.floor(amount).toLocaleString()}
{:else}
	{readableNumber(amount)}
{/if}
