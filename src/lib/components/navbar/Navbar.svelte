<script lang="ts">
	import Logo from '$lib/components/logo/Logo.svelte';
	import MdAccountBalanceWallet from '$lib/icons/MdAccountBalanceWallet.svelte';
	import { getStores } from '$app/stores';
	import UseWallet, { connectedAccount, walletDisconnect } from '$lib/components/UseWallet.svelte';
	import { openModal } from '../modal/Modal.svelte';
	import ConnectWallet from '$lib/components/modal/ConnectWallet.svelte';
	import { addNotification } from '$lib/components/Notify.svelte';
	import { knownPools, knownTokens } from '$lib';
	import { pageContentRefresh } from '$lib/utils';
	import BalanceSubscriber from '$lib/components/BalanceSubscriber.svelte';
	import { getEnvoi } from '$lib/envoi';

	const { page } = getStores();
	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<div class="navbar-wrapper" class:scrolled={scrollY > 10}>
	<nav class="navbar flex flex-col sm:flex-row text-gray-100 max-w-screen-2xl mx-auto">
		<div class="navbar-brand">
			<div class="logo-wrapper">
				<a class="text-primary" aria-label="Nomadex" href="/"><Logo /></a>
			</div>
		</div>
		<div class="space hidden sm:block"></div>
		<ul>
			<li class="flex">
				<a class:active={$page.url.pathname.match(/\/\d+\/\d+\/\d+\/\d+/)} href="/">Swap</a>
			</li>

			<li class="flex">
				<a class:active={$page.url.pathname.startsWith('/pool')} href="/pool">Pool</a>
			</li>

			<li class="hidden md:flex">
				<a class:active={$page.url.pathname.startsWith('/tokens')} href="/tokens">Token</a>
			</li>

			<li class="flex">
				<a
					class:active={$page.url.pathname.startsWith('/analytics')}
					href="/analytics/{$knownPools?.[0]?.id ?? 0}"
					onclick={() => pageContentRefresh()}
				>
					Analytics
				</a>
			</li>
		</ul>
		<div class="actions ml-auto flex gap-2">
			{#if $connectedAccount}
				{@const userKey = `${$connectedAccount}:0`}
				<span class="connected-info flex flex-col items-end p-2 rounded text-sm cursor-default">
					<BalanceSubscriber
						subscriptions={{
							[userKey]: $knownTokens[0],
						}}
					>
						{#snippet balance_result(result)}
							<span class="text-nowrap">{(Number(result[userKey]) / 1e6).toLocaleString()} VOI</span>
						{/snippet}
					</BalanceSubscriber>
					<button
						class="font-bold"
						onclick={() => {
							navigator.clipboard.writeText($connectedAccount);
							addNotification('info', 'Copied to clipboard', 1000);
						}}
					>
						{#await getEnvoi($connectedAccount)}
							{$connectedAccount.slice(0, 3)}...{$connectedAccount.slice(-3)}
						{:then envoi}
							{#if envoi}
								{envoi}
							{:else}
								{$connectedAccount.slice(0, 3)}...{$connectedAccount.slice(-3)}
							{/if}
						{/await}
					</button>
				</span>
				<button
					class="btn btn-ghost bg-[#00000040] hover:bg-[#00000050] text-primary"
					onclick={() => walletDisconnect()}
				>
					<span class="inline-block h-6 w-6"><MdAccountBalanceWallet /></span>
					Disconnect
				</button>
			{:else}
				<button
					class="btn btn-ghost bg-[#00000040] hover:bg-[#00000050] text-primary"
					onclick={() => openModal(ConnectWallet, {})}
				>
					<span class="inline-block h-6 w-6"><MdAccountBalanceWallet /></span>
					Connect Wallet
				</button>
			{/if}
		</div>
	</nav>
	<UseWallet />
</div>

<style>
	.navbar-wrapper {
		--height: 100px;
		--edge-height: 0px;
		--edge-width: 0.2rem;
		height: calc(var(--height) + var(--edge-height));
		background: transparent;
		transition: background-color 100ms;
		color: white;
		width: calc(100vw - 0rem);
		position: fixed;
		top: 0;
		z-index: 1000;
	}

	.navbar-wrapper.scrolled {
		background-color: #00000025;
		-webkit-backdrop-filter: blur(0.5em);
		backdrop-filter: blur(0.5em);
	}

	@media (max-width: 639px) {
		:global(html body) {
			padding-top: 0;
		}
		.navbar-wrapper {
			position: relative;
			--height: max-content;
			--edge-height: 50px;
		}

		ul {
			flex-wrap: wrap;
			justify-content: center;
		}
		.actions {
			width: 100%;
			justify-content: center;
		}
		.actions > span {
			display: flex;
			justify-content: center;
			/* align-items: center; */
		}
	}

	.navbar {
		height: var(--height);
		overflow: hidden;
		display: flex;
		align-items: center;
		padding: 1rem;
		gap: 1rem;
		overflow-x: auto;
	}

	.logo-wrapper {
		width: 2rem;
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
		border: 2.5px solid currentColor;
		border-radius: 8px;
	}

	ul a {
		text-decoration: none;
		color: currentColor;
		font-weight: 400;
		transition: 100ms all;
		font-size: 17px;
		justify-content: center;
		align-items: center;
	}

	ul li {
		justify-content: center;
		align-items: center;
		padding: 0 0.25rem;
		border-radius: 8px;
		height: 2rem;
	}

	ul li:not(.hidden):hover a {
		opacity: 0.5;
	}
</style>
