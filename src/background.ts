import { DEFAULT_CONTEXT_MENUS } from "./constants";
import { ContextMenu } from "./types";

/**
 * Load context menus from the storage
 * Context menu items are stored in the storage and default items
 */
function loadContextMenus() {
  let menus = DEFAULT_CONTEXT_MENUS;
  // TODO: implements loading from the storage
  return menus;
}

/**
 * Register context menus recursively
 *
 * @param {*} menus
 * @param {*} parentId
 */
function registerContextMenus(
  menus: ContextMenu[],
  parentId: ContextMenu["parentId"] = undefined
) {
  menus.forEach((menu) => {
    let params = {
      id: menu.id,
      title: menu.title,
      contexts: menu.contexts,
    } as ContextMenu;
    if (parentId) params.parentId = parentId;
    if (menu.type) params.type = menu.type;

    chrome.contextMenus.create(params);

    if (menu.children) {
      registerContextMenus(menu.children, menu.id);
    }
  });
}

/**
 * Register context menus
 */
chrome.runtime.onInstalled.addListener(() => {
  registerContextMenus(loadContextMenus());
});

/**
 * Send a message to content.js when a context menu is clicked
 *
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return;
  try {
    chrome.tabs.sendMessage(tab.id!, {
      type: info.menuItemId,
      text: info.selectionText,
    });
  } catch (error) {
    console.error(`error: ${JSON.stringify(error)}`);
    alert("Please reload the page.");
  }
});
