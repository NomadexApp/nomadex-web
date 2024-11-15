<script lang="ts">
	type Option = { name: string; value: any };

	let {
		options,
		firstSelected,
		selected,
		selectedValue,
		displayPrefix,
		positon,
		onSelect = (value: any, option: Option) => {},
		class: className = '',
	}: {
		options?: Option[];
		firstSelected?: boolean;
		selected?: Option;
		selectedValue?;
		displayPrefix?: string;
		positon?: string;
		onSelect?: (value: any, option: Option) => void;
		class?: string;
	} = $props();

	let dropdownElement: HTMLDetailsElement;

	$effect(() => {
		selectedValue = selected?.value;
	});

	function handleOptClick(opt: Option) {
		return () => {
			selected = { ...opt };
			dropdownElement.removeAttribute('open');
			onSelect(opt.value, opt);
		};
	}
</script>

<details class="dropdown dropdown-content dropdown-{positon} dropdown-end" bind:this={dropdownElement}>
	<summary class="m-1 btn {className}">{displayPrefix} {selected?.name || 'None'}</summary>
	{#if options?.length}
		<div
			class="p-0 m-0 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-max border border-gray-500 list-none"
		>
			{#each options as opt}
				<button onclick={handleOptClick(opt)} class="border-b border-gray-500 w-full m-0 pl-0">
					<span>{opt.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</details>
