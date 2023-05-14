import { CONFIG_NAMES, MODELS } from "./constants";
import { Config } from "./types";

/**
 * Validate the config
 */
function validateConfig(config: Config) {
  if (config.apiKey === "") {
    alert("Please set your OpenAI API key in the config page.");
    return false;
  }

  const apiType = config.apiType;
  if (!apiType || apiType === "") return false;
  const models = MODELS[apiType];
  const model = config.model || '';
  if (models.indexOf(model) === -1) {
    alert("Please set your model in the config page.");
    return false;
  }

  if (config.apiType === "azure") {
    if (config.endpoint === "") {
      alert("Please set your Azure endpoint in the config page.");
      return false;
    }
  }

  return true;
}

/**
 * Set the model config based on the API type
 */
function updateModelConfig(apiType: Config["apiType"], selected = null) {
  const elem = getInputElementById("model");
  if (!elem) return;

  const models: string[] = MODELS[apiType!];
  console.log(`models: ${JSON.stringify(models)}`)

  elem.innerHTML = "";
  models.forEach(model => {
    const option = document.createElement("option");
    option.value = model;
    option.text = model;
    elem.appendChild(option);
  });

  if (selected) {
    elem.value = selected;
  } else {
    elem.value = models[0];
  }
}

/**
 * Toggle the Azure config
 *
 * @param {*} apiType
 */
function toggleAzureConfig(apiType: Config["apiType"]) {
  const elements = document.getElementsByClassName("onlyAzure") as HTMLCollectionOf<HTMLElement>;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (apiType === "azure") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }
}

function getInputElementById(id: string) {
  return document.getElementById(id) as HTMLInputElement;
}

/**
 * Load the current config and set the event listeners
 */
document.addEventListener("DOMContentLoaded", () => {
  // Load the current config
  chrome.storage.sync.get(CONFIG_NAMES, config => {
    getInputElementById("language").value = config.language || "english";
    getInputElementById("apiKey").value = config.apiKey || "";
    getInputElementById("endpoint").value = config.endpoint || "";

    const apiType = config.apiType || "openai";
    const elem = getInputElementById("apiType");
    elem.value = apiType || '';
    toggleAzureConfig(apiType);
    updateModelConfig(apiType, config.model);

    // On change of the API type, toggle the Azure config and update the model config
    elem?.addEventListener("change", () => {
      const apiType = getInputElementById("apiType").value;
      console.log(`apiType: ${apiType}`)
      toggleAzureConfig(apiType);
      updateModelConfig(apiType);
    });
  });

  // Save the config when the "Save" button is clicked
  getInputElementById("saveButton").addEventListener("click", () => {
    const config = CONFIG_NAMES.reduce((obj, key: string) => {
      obj[key] = getInputElementById(key).value.toString() || '';
      return obj;
    }, {} as Config);

    if (validateConfig(config as Config)) {
      chrome.storage.sync.set(config, () => {
        alert("Config saved.");
      });
    }
  });
});
