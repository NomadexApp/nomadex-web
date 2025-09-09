import { PUBLIC_NETWORK } from "$env/static/public";
import algosdk from "algosdk";

const nullToken =
	"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const args = {
	voimain: {
		api: ["", `https://voimain-api.nomadex.app`, ""],
		idx: ["", `https://voimain-idx.nomadex.app`, ""],
	},
	voitest: {
		api: ["", `https://voitest-api.nomadex.app`, ""],
		idx: ["", `https://voitest-idx.nomadex.app`, ""],
	},
	localnet: {
		api: [nullToken, `http://localhost`, `4001`],
		idx: [nullToken, `http://localhost`, `8980`],
	},
} as const;

export const network = args[PUBLIC_NETWORK as keyof typeof args];

export const nodeClient = new algosdk.Algodv2(
	network.api[0],
	network.api[1],
	network.api[2],
);
export const indexerClient = new algosdk.Indexer(
	network.idx[0],
	network.idx[1],
	network.idx[2],
);

export const getBalance = async (address: string, withoutMinBalance = true) => {
	if (!address) return 0;
	const accountInfo = await nodeClient.accountInformation(address).do();
	return accountInfo.amount -
		(withoutMinBalance ? accountInfo["min-balance"] : 0);
};
