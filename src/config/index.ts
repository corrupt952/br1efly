import { CONFIG_NAMES } from "@/constants";
import { Config } from "@/types";

/**
 * Returns the current config
 *
 * @returns
 */
export async function fetchConfig(): Promise<Config> {
  return new Promise(async (resolve, reject) => {
    const config = await chrome.storage.sync.get(CONFIG_NAMES) as Config;
    resolve(config);
    return config;
  });
}
