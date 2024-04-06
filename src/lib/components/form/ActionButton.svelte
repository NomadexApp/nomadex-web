<div class="buttons">
	<button class="btn w-full action-btn" on:click><slot /></button>
</div>

<style>
	.action-btn {
		background: #ffff6622;
		color: var(--primary-color);
	}
	.action-btn:hover {
		background: #ffff6633;
		color: var(--primary-color);
	}
</style>
