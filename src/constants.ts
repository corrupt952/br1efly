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
      {
        id: "convert",
        title: "Convert(Experimental)",
        contexts: ["selection"],
        children: [
          {
            id: "convert_to_markdown",
            title: "To Markdown",
            contexts: ["selection"],
          },
          {
            id: "convert_to_json",
            title: "To JSON",
            contexts: ["selection"],
          },
          {
            id: "convert_to_yaml",
            title: "To YAML",
            contexts: ["selection"],
          },
        ],
      },
      {
        id: "programming",
        title: "Programming(Experimental)",
        contexts: ["selection"],
        children: [
          {
            id: "programming_in_ruby",
            title: "In Ruby",
            contexts: ["selection"],
          },
          {
            id: "programming_in_python",
            title: "In Python",
            contexts: ["selection"],
          },
          {
            id: "programming_in_javascript",
            title: "In JavaScript",
            contexts: ["selection"],
          },
          {
            id: "programming_in_typescript",
            title: "In TypeScript",
            contexts: ["selection"],
          },
          {
            id: "programming_in_go",
            title: "In Go",
            contexts: ["selection"],
          },
          {
            id: "programming_in_rust",
            title: "In Rust",
            contexts: ["selection"],
          },
        ],
      },
    ],
  },
];

export const DEFAULT_PROMPTS: PromptMap = {
  summarize: "Please summarize the following in one line.",
  paraphrase: "Please suggest three bulleted paraphrases of the following.",
  detect_language: "Please detect the language of the following.",
  counterproposal: "Please suggest a counterproposal to the following.",
  proofreading: "Please proofread the following.",
  // Convert
  convert_to_markdown: "Please convert the following to Markdown.",
  convert_to_json: "Please convert the following to JSON.",
  convert_to_yaml: "Please convert the following to YAML.",
  // Programming
  // TODO: Rewrite programming prompts
  programming_in_ruby:
    "Write a program in Ruby that meets the following requirements.",
  programming_in_python:
    "Write a program in Python that meets the following requirements.",
  programming_in_javascript:
    "Write a program in JavaScript that meets the following requirements.",
  programming_in_typescript:
    "Write a program in TypeScript that meets the following requirements.",
  programming_in_go:
    "Write a program in Go that meets the following requirements.",
  programming_in_rust:
    "Write a program in Rust that meets the following requirements.",
};
