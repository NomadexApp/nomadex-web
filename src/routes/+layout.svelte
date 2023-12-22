<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';
	import '../app.css';
</script>

<Sidebar><slot /></Sidebar>
<div class="md:hidden flex w-[calc(100vw)] h-[calc(100vh)] justify-center items-center">
	This screen size not supported for now
</div>
