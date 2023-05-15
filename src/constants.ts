import { ContextMenu, Prompt } from "./types";

export const LANGUAGES: {[key: string]: string} = {
  "english": "English",
  "japanese": "日本語",
  "chinese": "中文",
  "korean": "한국어",
  "thai": "ไทย",
  "vietnamese" : "Tiếng Việt",
};

export const CONFIG_NAMES: string[] = [
  "language",
  "apiType",
  "apiKey",
  "model",
  "endpoint",
];

export const MODELS: {
  [key: string]: string[];
  openai: string[];
  azure: string[];
} = {
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
      {
        id: "draw",
        title: "Draw(Experimental)",
        contexts: ["selection"],
        children: [
          {
            id: "draw_mermaid_flowchart",
            title: "Mermaid.js Flowchart",
            contexts: ["selection"],
          },
          {
            id: "draw_mermaid_sequence_diagram",
            title: "Mermaid.js Sequence Diagram",
            contexts: ["selection"],
          },
          {
            id: "draw_mermaid_gantt_diagram",
            title: "Mermaid.js Gantt Diagram",
            contexts: ["selection"],
          },
          {
            id: "draw_mermaid_class_diagram",
            title: "Mermaid.js Class Diagram",
            contexts: ["selection"],
          },
          {
            id: "draw_mermaid_git_graph",
            title: "Mermaid.js Git Graph",
            contexts: ["selection"],
          },
          {
            id: "draw_mermaid_erd",
            title: "Mermaid.js ERD",
            contexts: ["selection"],
          },
          {
            id: "draw_mermaid_user_journey_diagram",
            title: "Mermaid.js User Journey Diagram",
            contexts: ["selection"],
          },
          {
            id: "draw_mermaid_pie_chart",
            title: "Mermaid.js Pie Chart",
            contexts: ["selection"],
          },
        ],
      },
    ],
  },
];

export const DEFAULT_PROMPT = {
  translate: true,
  parameters: {
    top_p: 0.8,
  },
};

export const DEFAULT_PROMPTS: { [key: string]: Prompt } = {
  summarize: {
    ...DEFAULT_PROMPT,
    message: "Please summarize the following in one line.",
    translate: true,
  },
  paraphrase: {
    ...DEFAULT_PROMPT,
    message: "Please suggest three bulleted paraphrases of the following.",
    translate: true,
  },
  detect_language: {
    ...DEFAULT_PROMPT,
    message: "Please detect the language of the following.",
    translate: true,
  },
  counterproposal: {
    ...DEFAULT_PROMPT,
    message: "Please suggest a counterproposal to the following.",
    translate: true,
  },
  proofreading: {
    ...DEFAULT_PROMPT,
    message: "Please proofread the following.",
    translate: true,
  },
  // Convert
  convert_to_markdown: {
    ...DEFAULT_PROMPT,
    message: "Please convert the following to Markdown.",
    translate: false,
  },
  convert_to_json: {
    ...DEFAULT_PROMPT,
    message: "Please convert the following to JSON.",
    translate: false,
  },
  convert_to_yaml: {
    ...DEFAULT_PROMPT,
    message: "Please convert the following to YAML.",
    translate: false,
  },
  // Programming
  programming_in_ruby: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a program in Ruby that meets the following requirements.",
  },
  programming_in_python: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a program in Python that meets the following requirements.",
  },
  programming_in_javascript: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a program in JavaScript that meets the following requirements.",
  },
  programming_in_typescript: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a program in TypeScript that meets the following requirements.",
  },
  programming_in_go: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a program in Go that meets the following requirements.",
  },
  programming_in_rust: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a program in Rust that meets the following requirements.",
  },
  // Draw
  draw_mermaid_flowchart: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js flowchart according to the following requirements.",
  },
  draw_mermaid_sequence_diagram: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js sequence diagram according to the following requirements.",
  },
  draw_mermaid_gantt_diagram: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js Gantt diagram according to the following requirements.",
  },
  draw_mermaid_class_diagram: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js class diagram according to the following requirements.",
  },
  draw_mermaid_git_graph: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js Git graph according to the following requirements.",
  },
  draw_mermaid_erd: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js ERD according to the following requirements.",
  },
  draw_mermaid_user_journey_diagram: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js user journey diagram according to the following requirements.",
  },
  draw_mermaid_pie_chart: {
    ...DEFAULT_PROMPT,
    message:
      "Please write a Mermaid.js pie chart according to the following requirements.",
  },
};
