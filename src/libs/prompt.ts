import { fetchConfig } from "@/config";
import { DEFAULT_CONTEXT_MENUS, DEFAULT_PROMPTS } from "@/constants";
import { Config, ContextMenu, Prompt, PromptMap } from "@/types";
import yaml from "js-yaml";

/**
 * Validate yaml string for prompts
 */
export function validatePromptYaml(yamlString: string) {
  try {
    const prompts = yaml.load(yamlString) as PromptMap;
    if (!prompts) {
      return false;
    }
    // already exists key in prompts and DEFAULT_PROMPTS
    const keys = Object.keys(prompts);
    const defaultKeys = Object.keys(DEFAULT_PROMPTS);
    const duplicateKeys = keys.filter((key) => defaultKeys.indexOf(key) !== -1);
    if (duplicateKeys.length > 0) {
      console.log(`duplicateKeys: ${JSON.stringify(duplicateKeys)}`);
      return false;
    }
  } catch (e) {
    console.log(`error: ${e}`);
    return false;
  }
  return true;
}

/**
 * Returns user prompts from config
 */
async function userPrompts(): Promise<PromptMap> {
  const config = (await fetchConfig()) as Config;
  if (!config.prompts) return {};
  if (config.prompts === "") return {};

  try {
    const prompts = yaml.load(config.prompts) as PromptMap;
    if (!prompts) return {};
    return prompts;
  } catch (e) {
    console.error(e);
    return {};
  }
}

/**
 * Returns available prompts(DEFAULT_PROMPTS and user prompts)
 */
export async function prompts(): Promise<PromptMap> {
  const prompts = await userPrompts();
  return {
    ...DEFAULT_PROMPTS,
    ...prompts,
  };
}

/**
 * Returns context menus from prompts and default contentMenus
 */
export async function buildContextMenus(): Promise<ContextMenu[]> {
  const prompts = await userPrompts();
  if (!prompts) return DEFAULT_CONTEXT_MENUS;
  if (Object.keys(prompts).length === 0) return DEFAULT_CONTEXT_MENUS;

  const menus = Object.keys(prompts).map((key): ContextMenu => {
    const prompt = prompts[key];
    return {
      id: key,
      title: prompt.title || prompt.message,
      contexts: ["selection"],
    };
  });

  return [
    ...DEFAULT_CONTEXT_MENUS,
    {
      id: "separator_custom",
      type: "separator",
      contexts: ["selection"],
    },
    {
      id: "custom",
      title: "Custom",
      contexts: ["selection"],
      children: menus,
    },
  ];
}
