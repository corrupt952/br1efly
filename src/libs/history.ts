import { History } from "@/types";

/**
 * Record the history to chrome.storage.local
 *
 * @param history
 */
export function recordHistory(history: History) {
  chrome.storage.local.get("histories", (items) => {
    console.log(`items: ${JSON.stringify(items)}`);
    const histories = items.histories || [];
    histories.push(history);
    // TODO: limit the number of histories
    chrome.storage.local.set({ histories: histories });
  });
}

/**
 * Returns the histories from chrome.storage.local
 */
export function fetchHistories(): Promise<History[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("histories", (items) => {
      const histories = items.histories || [];
      resolve(histories);
    });
  });
}

