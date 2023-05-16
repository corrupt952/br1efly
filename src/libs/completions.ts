import { fetchConfig } from "@/config";
import { recordHistory } from "@/libs/history";
import { prompts } from "@/libs/prompt";
import { Config, Message, Prompt } from "@/types";

/**
 * Build messages for the completion
 */
function buildMessages(language: string, prompt: Prompt, selection: string) {
  let messages: Message[] = [
    {
      role: "system",
      content: prompt.message,
    },
    {
      role: "user",
      content: selection,
    },
  ];
  if (prompt.translate) {
    messages.push({
      role: "system",
      content: `Answer in ${language}`,
    });
  }
  return messages;
}

/**
 * Request the completion to the OpenAI API
 *
 * @param {*} apiKey
 * @param {*} model
 * @param {*} messages
 */
async function completionByOpenAI(
  apiKey: string,
  model: string,
  messages: Message[],
  parameters: Prompt["parameters"] = {}
) {
  // https://platform.openai.com/docs/api-reference/chat
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; utf-8",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      ...parameters,
    }),
  });

  if (!response.ok) {
    alert(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  const content = data.choices[0].message.content;
  return content;
}

/**
 * Request the completion to the Azure API
 *
 * @param {*} endpoint
 * @param {*} apiKey
 * @param {*} model
 * @param {*} messages
 */
async function completionByAzure(
  endpoint: Config["endpoint"],
  apiKey: Config["apiKey"],
  model: Config["model"],
  messages: Message[],
  parameters: Prompt["parameters"] = {}
) {
  // https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference#chat-completions
  const apiVersion = "2023-03-15-preview";
  const response = await fetch(
    `${endpoint}/openai/deployments/${model}/chat/completions?api-version=${apiVersion}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; utf-8",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: messages,
        ...parameters,
      }),
    }
  );

  if (!response.ok) {
    alert(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  const content = data.choices[0].message.content;
  return content;
}

/**
 * Returns the completion of the prompt and the selection
 *
 * @param {*} prompt
 * @param {*} selection
 */
export async function completions(type: string, selection: string) {
  const config = (await fetchConfig()) as Config;
  const apiKey = config.apiKey;
  if (apiKey === "") {
    alert("Please set your OpenAI API key in the config page.");
    return;
  }

  const prompt = (await prompts())[type];
  if (prompt.message === "") {
    alert(`Sorry, ${type} is not implemented yet.`);
    return;
  }

  const messages = buildMessages(config.language, prompt, selection);
  let result = null;
  if (config.apiType === "azure") {
    result = await completionByAzure(
      config.endpoint,
      apiKey,
      config.model,
      messages,
      prompt.parameters
    );
  } else {
    result = await completionByOpenAI(
      apiKey,
      config.model,
      messages,
      prompt.parameters
    );
  }
  recordHistory({
    url: window.location.href,
    type: type,
    messages: messages,
    selection: selection,
    result: result,
  });
  return result;
}
