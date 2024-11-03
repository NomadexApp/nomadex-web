<script lang="ts">
	export let data: [string, string][];
</script>

<div class="info text-gray-300 text-sm flex flex-col">
	{#each data as info}
		{@const impact = Number(info[1].slice(0, -1))}
		<div class="">
			<div class="">{info[0]}</div>
			<div class="text-right">
				{#if info[0] === 'Price impact' && impact > 5}
					<span style="color: hsl({Math.min(40, Math.max(10, 40 - impact))} 100% 50%);">[expensive]</span>
				{/if}
				{info[1]}
			</div>
		</div>
	{/each}
</div>

<style>
	.info {
		padding: 0 4px;
	}
	.info > div {
		display: flex;
		justify-content: space-between;
	}
</style>
