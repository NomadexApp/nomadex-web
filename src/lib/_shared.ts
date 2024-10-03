import { PUBLIC_NETWORK } from '$env/static/public';
import algosdk from 'algosdk';

export const nodeClient = new algosdk.Algodv2(``, `https://${PUBLIC_NETWORK}-api.nomadex.app`, ``);
export const indexerClient = new algosdk.Indexer('', `https://${PUBLIC_NETWORK}-idx.nomadex.app`, '');

export const getBalance = async (address: string, withoutMinBalance = true) => {
	if (!address) return 0;
	const accountInfo = await nodeClient.accountInformation(address).do();
	return accountInfo.amount - (withoutMinBalance ? accountInfo['min-balance'] : 0);
};
