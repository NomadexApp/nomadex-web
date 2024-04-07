<script lang="ts">
	import Logo from '$lib/components/logo/Logo.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import LogoutIcon from 'svelte-star/dist/md/MdPowerSettingsNew.svelte';
	import { getStores } from '$app/stores';
	import UseWallet, { connectedAccount, walletDisconnect } from '$lib/UseWallet.svelte';
	import { openModal } from '../modal/Modal.svelte';
	import ConnectWallet from '$lib/components/modal/ConnectWallet.svelte';
	import { getLastActivePair } from '$lib/config';
	import { lastActiveSwapPair } from '$lib/stores';

	const { page } = getStores();
</script>

<!-- {#each Array(3).fill(0) as i}
	<span
		class="star"
		style="top: {100 + Math.random() * 25}px;left: {Math.random() *
			window.innerWidth}px;transform: rotate({Math.random() * 360}deg);"
	>
		★
	</span>
{/each} -->
<div class="navbar-wrapper">
	<nav class="navbar">
		<div class="navbar-brand">
			<div class="logo-wrapper">
				<a href="/"><Logo /></a>
			</div>
		</div>
		<div class="space" />
		<ul>
			<li>
				<a class:active={$page.url.pathname.startsWith('/swap/')} href="/swap/{getLastActivePair($lastActiveSwapPair)}">Swap</a>
			</li>

			<li>
				<a class:active={$page.url.pathname.startsWith('/pool')} href="/pool">Pool</a>
			</li>

			<li>
				<a class:active={$page.url.pathname.startsWith('/limit')} href="/limit">Limit</a>
			</li>

			<li>
				<a class:active={$page.url.pathname.startsWith('/analytics')} href="/analytics">Analytics</a>
			</li>

			<li>
				<a href="https://v01.nomadex.app" target="_blank">v0.1</a>
			</li>
		</ul>
		<div class="actions">
			<!-- <UseWallet /> -->
			{#if $connectedAccount}
				<button class="btn bg-[#222211] hover:bg-[#333311]" on:click={() => walletDisconnect()}>
					<span class="inline-block h-6 w-6"><LogoutIcon /></span>
					Disconnect ({$connectedAccount.slice(0, 4)})
				</button>
			{:else}
				<button class="btn bg-[#222211] hover:bg-[#333311]" on:click={() => openModal(ConnectWallet, {})}>
					<span class="inline-block h-6 w-6"><LogoutIcon /></span>
					Connect Wallet
				</button>
			{/if}
		</div>
	</nav>
</div>

<style>
	.navbar-wrapper {
		width: 100vw;
		height: calc(200px);
		background: linear-gradient(to bottom, var(--primary-color) 100px, #333333);
		position: fixed;
		top: 0;
		z-index: 1000;
		clip-path: polygon(0 0, 100% 0, 100% 100%,calc(100% - 1rem) calc(100% - 100px), 1rem calc(100% - 100px), 0 100%);
	}

	.navbar {
		height: 100px;
		overflow: hidden;
		max-width: 1500px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		padding: 1rem;
		gap: 1rem;
		overflow-x: auto;
	}

	.logo-wrapper {
		width: 2rem;
	}

	.logo-wrapper a {
		color: var(--secondary-color);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 0.5rem;
		margin-left: -0rem;
		align-items: center;
	}

	.space {
		margin: 0 0rem;
		width: 5px;
		height: 5px;
		border: 2px solid black;
		border-radius: 8px;
		/* animation: animate 100s linear infinite; */
	}

	/* @keyframes animate {
		0% {
			background: black;
		}
		50% {
			background: #222222;
		}
		100% {
			background: black;
		}
	} */

	ul a {
		text-decoration: none;
		color: #000000;
		font-weight: 400;
		padding: 0.25rem 0.5rem;
		transition: 100ms all;
		/* box-shadow: 1px 1px 0px #aaa; */
		font-size: 15px;
		/* width: 80px; */
		display: flex;
		justify-content: center;
		opacity: 0.7;
	}

	a.active {
		font-weight: 500;
	}

	.actions {
		margin-left: auto;
	}
</style>
