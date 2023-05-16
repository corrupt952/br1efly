import { CONFIG_NAMES, LANGUAGES, MODELS } from "@/constants";
import { validatePromptYaml } from "@/libs/prompt";
import { Config } from "@/types";
import { fetchConfig } from "./config";

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
  const model = config.model || "";
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

  if (config.prompts !== "" && !validatePromptYaml(config.prompts)) {
    alert("Invalid YAML format.\nPlease check the syntax of the YAML.");
    return false;
  }

  return true;
}

/**
 * Set the language from LANGUAGES
 */
function buildLanguageOptions(selected?: string) {
  const elem = getInputElementById("language");
  if (!elem) return;

  const languages = Object.keys(LANGUAGES);
  const language = selected || languages[0];
  elem.innerHTML = "";
  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language;
    option.text = LANGUAGES[language];
    elem.appendChild(option);
  });
  elem.value = language;
}

/**
 * Set the model config based on the API type
 */
function buildModelOptions(apiType: Config["apiType"], selected?: string) {
  const elem = getInputElementById("model");
  if (!elem) return;

  const models: string[] = MODELS[apiType!];

  elem.innerHTML = "";
  models.forEach((model) => {
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
  const elements = document.getElementsByClassName(
    "onlyAzure"
  ) as HTMLCollectionOf<HTMLElement>;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (apiType === "azure") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }
}

/**
 * Returns the input element by the id
 *
 * @param id
 * @returns
 */
function getInputElementById(id: string) {
  return document.getElementById(id) as HTMLInputElement;
}

/**
 * Initialize option page with the current config
 */
function initialize(config: Config) {
  buildLanguageOptions(config.language);
  getInputElementById("apiKey").value = config.apiKey || "";
  getInputElementById("endpoint").value = config.endpoint || "";
  if (config.prompts && config.prompts !== "") {
    getInputElementById("prompts").value = config.prompts;
  }

  const apiType = config.apiType || "openai";
  const elem = getInputElementById("apiType");
  elem.value = apiType || "";
  toggleAzureConfig(apiType);
  buildModelOptions(apiType, config.model);

  // On change of the API type, toggle the Azure config and update the model config
  elem.addEventListener("change", () => {
    const apiType = getInputElementById("apiType").value;
    toggleAzureConfig(apiType);
    buildModelOptions(apiType);
  });

  // Setup show and hide of the API key and endpoint
  getInputElementById("showApiKey").addEventListener("change", () => {
    const elem = getInputElementById("apiKey");
    if (elem.type === "password") {
      elem.type = "text";
    } else {
      elem.type = "password";
    }
  });
  getInputElementById("showEndpoint").addEventListener("change", () => {
    const elem = getInputElementById("endpoint");
    if (elem.type === "password") {
      elem.type = "text";
    } else {
      elem.type = "password";
    }
  });

  // Save the config when the "Save" button is clicked
  getInputElementById("saveButton").addEventListener("click", () => {
    const config = CONFIG_NAMES.reduce((obj, key: string) => {
      obj[key] = getInputElementById(key).value.toString() || "";
      return obj;
    }, {} as Config);

    if (validateConfig(config as Config)) {
      chrome.storage.sync.set(config, () => {
        alert("Config saved.");
      });
      chrome.runtime.sendMessage({ type: "reload_context_menu" });
    }
  });
}

/**
 * Load the current config and set the event listeners
 */
document.addEventListener("DOMContentLoaded", async () => {
  const config = await fetchConfig();
  initialize(config);
});
