<script lang="ts">
	import { type Pool, type Token } from '$lib';
	import { nodeClient } from '$lib/_shared';
	import { getTransactionSignerAccount } from '$lib/components/UseWallet.svelte';
	import { PoolClient } from '../../../contracts/clients/PoolClient';
	import { addNotification } from '$lib/components/Notify.svelte';

	export let onUpdate = () => {};

	type AddLiquidityOpts = {
		pool: Pool;
		selectionPk: string;
		stateProofPk: string;
		votePk: string;
		voteFirst: number;
		voteLast: number;
		voteKeyDilution: number;
	};
	async function registerOnline({ pool, selectionPk, stateProofPk, votePk, voteFirst, voteLast, voteKeyDilution }: AddLiquidityOpts) {
		const remove = addNotification('pending', `Adding liquidity...`);

		const poolClient = new PoolClient(
			{
				id: pool.id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		try {
			const resp = await poolClient.registerOnline(
				{
					selectionPk: Uint8Array.from(Buffer.from(selectionPk, 'base64')),
					stateProofPk: Uint8Array.from(Buffer.from(stateProofPk, 'base64')),
					votePk: Uint8Array.from(Buffer.from(votePk, 'base64')),
					voteFirst,
					voteKeyDilution,
					voteLast,
				},
				{
					sendParams: { populateAppCallResources: true },
				}
			);

			onUpdate();

			return resp.return;
		} catch (e) {
			console.error(e);
		} finally {
			remove();
		}
	}

	type RemoveLiquidityOpts = { pool: Pool };
	async function registerOffline({ pool }: RemoveLiquidityOpts) {
		const remove = addNotification('pending', `Register offline...`);

		const poolClient = new PoolClient(
			{
				id: pool.id,
				resolveBy: 'id',
				sender: getTransactionSignerAccount(),
			},
			nodeClient
		);

		try {
			const resp = await poolClient.registerOffline(
				{},
				{
					sendParams: { populateAppCallResources: true },
				}
			);

			onUpdate();
			return resp.return;
		} catch (e) {
			console.error(e);
		} finally {
			remove();
		}
	}
</script>

<slot {registerOnline} {registerOffline} />
