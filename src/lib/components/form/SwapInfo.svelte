<script lang="ts">
	export let data: [string, string][];
</script>

<div class="info text-[#fff9] text-sm">
	{#each data as info}
		<div>
			<span>{info[0]}</span>
			<span>{info[1]}</span>
		</div>
	{/each}
</div>

<style>
	.info {
		display: flex;
		flex-direction: column;
	}
	.info div {
		display: flex;
		justify-content: space-between;
	}
</style>
