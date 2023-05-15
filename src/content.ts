import { DEFAULT_PROMPTS } from "./constants";
import { Config, Message } from "./types";

/**
 * Returns the current config
 *
 * @returns
 */
async function fetchConfig() {
  return new Promise((resolve, reject) => {
    return chrome.storage.sync.get(
      ["language", "apiKey", "model", "apiType", "endpoint"],
      resolve
    );
  });
}

/**
 * Show dialog to indicate processing
 *
 * @param {*} x
 * @param {*} y
 */
function showProcessing(x: number, y: number) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.backgroundColor = "white";
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  div.style.zIndex = "1000";
  div.style.color = "black";
  div.innerText = "Processing...";
  document.body.appendChild(div);
  return div;
}

/**
 * Show the output in a popup
 *
 * @param {*} output
 * @param (*) x
 * @param {*} y
 */
function popupOutput(output: string, x: number, y: number) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.backgroundColor = "white";
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  div.style.zIndex = "1000";
  div.style.color = "black";
  div.innerText = output;
  // br
  div.appendChild(document.createElement("br"));
  // Close button
  const closeButton = document.createElement("button");
  closeButton.style.backgroundColor = "grey";
  closeButton.style.borderRadius = "5px";
  closeButton.style.color = "black";
  closeButton.style.padding = "5px";
  closeButton.innerText = "Close";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(div);
  });
  div.appendChild(closeButton);
  // Copy to clipboard button
  const copyButton = document.createElement("button");
  copyButton.style.backgroundColor = "grey";
  copyButton.style.borderRadius = "5px";
  copyButton.style.color = "black";
  copyButton.style.padding = "5px";
  copyButton.innerText = "Copy to clipboard";
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(output);
  });
  div.appendChild(copyButton);
  document.body.appendChild(div);
}

/**
 * Build messages for the completion
 */
function buildMessages(language: string, prompt: string, selection: string) {
  const messages: Message[] = [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: selection
    },
    {
      role: "system",
      content: `Answer in ${language}`
    }
  ];
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
      top_p: 0.8,
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
  messages: Message[]
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
        top_p: 0.8,
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
async function completions(type: string, selection: string) {
  const config = (await fetchConfig()) as Config;

  const prompt = DEFAULT_PROMPTS[type] || '';
  if (prompt === "") {
    alert(`Sorry, ${type} is not implemented yet.`);
    return;
  }

  const apiKey = config.apiKey;
  if (apiKey === "") {
    alert("Please set your OpenAI API key in the config page.");
    return;
  }

  const messages = buildMessages(config.language, prompt, selection);
  if (config.apiType === "azure") {
    return await completionByAzure(
      config.endpoint,
      apiKey,
      config.model,
      messages
    );
  } else {
    return await completionByOpenAI(apiKey, config.model, messages);
  }
}

/**
 * Listen to the message from the background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const selection = window.getSelection();
  const range = selection!.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const x = rect.left + window.pageXOffset;
  const y = rect.bottom + window.pageYOffset;

  const processing = showProcessing(x, y);
  completions(request.type, request.text)
    .then((result) => {
      popupOutput(result, x, y);
    })
    .catch((error) => {
      console.error(`error: ${JSON.stringify(error)}`);
    })
    .finally(() => {
      document.body.removeChild(processing);
    });
});
