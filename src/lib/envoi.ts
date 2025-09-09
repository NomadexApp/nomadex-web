import envoiSDK from "@xarmian/envoi-sdk";
import { network } from "./_shared";

const resolver = envoiSDK.init({
    token: network.api[0],
    url: network.api[1],
    port: Number(network.api[2] || "443"),
});

const pending = new Map<string, Promise<string[]>>();
const cache = new Map<string, string>();

export async function getEnvoi(address: string) {
    try {
        if (cache.has(address)) return cache.get(address);
        const promise = pending.get(address) ??
            resolver.http.getNameFromAddress(address);
        if (!pending.has(address)) {
            pending.set(address, promise);
        }
        const name = await promise;
        const envoi = name?.[0];
        if (envoi) {
            cache.set(address, envoi);
            pending.delete(address);
        } else {
            cache.set(address, "");
            pending.delete(address);
        }
        return envoi;
    } catch (e) {
        cache.set(address, "");
        pending.delete(address);
        return "";
    }
}
