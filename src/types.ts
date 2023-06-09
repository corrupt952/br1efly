export type Config = {
  [key: string]: string;

  language: string;
  apiType: string;
  apiKey: string;
  model: string;
  endpoint: string;
};

export type Prompt = {
  title?: string;
  message: string;
  translate?: boolean;
  parameters?: {
    top_p?: number;
    temperature?: number;
    max_tokens?: number;
    stop?: string[];
    presence_penalty?: number;
    frequency_penalty?: number;
  };
};

export type PromptMap = {
  [key: string]: Prompt;
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
};

export type History = {
  [key: string]: string | Message[];

  url: string;
  type: string;
  selection: string;
  messages: Message[];
  result: string;
}
