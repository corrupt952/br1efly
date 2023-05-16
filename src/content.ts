import { fetchConfig } from "@/config";
import { prompts } from "@/libs/prompt";
import { Config, Message, Prompt } from "@/types";
import { recordHistory } from "@/libs/history";

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

  // Adjust the position of the popup
  // If the popup is out of the window, move it inside
  const rect = div.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    div.style.left = `${window.innerWidth - rect.width}px`;
  }
  if (rect.bottom > window.innerHeight) {
    div.style.top = `${window.innerHeight - rect.height}px`;
  }
}

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
async function completions(type: string, selection: string) {
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
