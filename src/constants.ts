import { ContextMenu, ModelMap, PromptMap } from "./types";

export const LANGUAGES = [
  "english",
  "japanese",
  "chinese",
  "korean",
  "thai",
  "vietnamese",
];

export const CONFIG_NAMES: string[] = [
  "language",
  "apiType",
  "apiKey",
  "model",
  "endpoint",
];

export const MODELS: ModelMap = {
  // https://platform.openai.com/docs/models/model-endpoint-compatibility
  openai: [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-32k",
    "gpt-4-32k-0314",
  ],
  // https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference#chat-completions
  azure: ["gpt-35-turbo"],
};

export const DEFAULT_CONTEXT_MENUS: ContextMenu[] = [
  {
    id: "br1efly",
    title: "br1efly",
    contexts: ["selection"],
    children: [
      {
        id: "summarize",
        title: "Summarize",
        contexts: ["selection"],
      },
      {
        id: "paraphrase",
        title: "Paraphrase",
        contexts: ["selection"],
      },
      {
        id: "detect_language",
        title: "Detect Language",
        contexts: ["selection"],
      },
      {
        id: "counterproposal",
        title: "Counterproposal",
        contexts: ["selection"],
      },
      {
        id: "proofreading",
        title: "Proofreading",
        contexts: ["selection"],
      },
      {
        id: "separator1",
        type: "separator",
        contexts: ["selection"],
      },
      // TODO: implements convert data format
      {
        id: "convert_to_markdown",
        title: "Convert to Markdown(Not implemented))",
        contexts: ["selection"],
      },
      {
        id: "convert_to_json",
        title: "Convert to JSON(Not implemented))",
        contexts: ["selection"],
      },
      {
        id: "convert_to_yaml",
        title: "Convert to YAML(Not implemented)",
        contexts: ["selection"],
      }
    ],
  },
];

export const DEFAULT_PROMPTS: PromptMap = {
  summarize: "Please summarize the following in one line.",
  paraphrase: "Please suggest three bulleted paraphrases of the following.",
  detect_language: "Please detect the language of the following.",
  counterproposal: "Please suggest a counterproposal to the following.",
  proofreading: "Please proofread the following.",
}
