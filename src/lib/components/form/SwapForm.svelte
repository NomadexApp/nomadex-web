<script>
	import TokenInput from '$lib/components/form/TokenInput.svelte';
	import ActionButton from '$lib/components/form/ActionButton.svelte';
	import FormTitle from '$lib/components/form/FormTitle.svelte';
	import SwapInfo from '$lib/components/form/SwapInfo.svelte';
	import Modal from '$lib/components/modal/Modal.svelte';
	import SelectTokenModal from '$lib/components/modal/SelectTokenModal.svelte';
	import { openModal } from '../modal/Modal.svelte';
</script>

<form class="form">
	<FormTitle>Swap VOI for VIA</FormTitle>

	<TokenInput
		pretext="You pay"
		token="VOI"
		on:click={() => {
			openModal(SelectTokenModal, {});
		}}
	/>

	<TokenInput
		pretext="You receive"
		token="VAI"
		on:click={() => {
			openModal(SelectTokenModal, {});
		}}
	/>

	<ActionButton>Swap</ActionButton>

	<SwapInfo
		data={[
			['Pool balance', '10m VOI / 12m VIA'],
			['Min received', '21,468 VIA'],
			['Price impact', '5.38%'],
			['Slippage', '0.1%'],
			['Fee', '1%'],
		]}
	/>
</form>

<style>
	form {
		background-color: var(--primary-color);
		margin: 100px auto 0 auto;
		height: max-content;
		padding: 2rem;
		background: #222211;
		border-radius: 8px;
		width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
