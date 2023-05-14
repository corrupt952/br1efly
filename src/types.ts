export type Config = {
  [key: string]: string;

  language: string;
  apiType: string;
  apiKey: string;
  model: string;
  endpoint: string;
};

export type ModelMap = {
  [key: string]: string[];

  openai: string[];
  azure: string[];
};

export type PromptMap = {
  [key: string]: string;
};

export type ContextMenu = {
  [key: string]: string | number | string[] | ContextMenu[] | undefined | null;

  id: string;
  title?: string;
  contexts: chrome.contextMenus.ContextType[];
  type?: chrome.contextMenus.ContextItemType;
  parentId?: string;
  children?: ContextMenu[];
};

export type Message = {
  [key: string]: string;

  role: "system" | "user";
  content: string;
}
