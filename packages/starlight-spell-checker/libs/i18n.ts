import { ensureLeadingSlash, ensureTrailingSlash } from "./path";
import type { StarlightUserConfig } from "./validation";

import dictionaryDe from "dictionary-de";
import dictionaryEn, { type Dictionary } from "dictionary-en";
import dictionaryEs from "dictionary-es";
import dictionaryFr from "dictionary-fr";
import dictionaryIt from "dictionary-it";
import dictionaryKo from "dictionary-ko";
import dictionaryPl from "dictionary-pl";
import dictionaryPt from "dictionary-pt";
import dictionaryRu from "dictionary-ru";

export function getLocaleConfig(config: StarlightUserConfig): LocaleConfig {
  if (!config.locales || Object.keys(config.locales).length === 0)
    return {
      defaultLocale: "",
      locales: [],
    };

  let defaultLocale = config.defaultLocale;
  const locales: string[] = [];

  for (const [dir, locale] of Object.entries(config.locales)) {
    if (!locale) continue;

    if (dir === "root") {
      if (!locale.lang) continue;

      defaultLocale = "";
    }

    locales.push(dir);
  }

  if (defaultLocale === undefined)
    return {
      defaultLocale: "",
      locales: [],
    };

  return {
    defaultLocale,
    locales,
  };
}

const dictionaryMapper: Record<string, any> = {
  ar: undefined,
  de: dictionaryDe,
  en: dictionaryEn,
  es: dictionaryEs,
  fr: dictionaryFr,
  hi: undefined,
  it: dictionaryIt,
  ja: undefined,
  ko: dictionaryKo,
  pl: dictionaryPl,
  "pt-BR": dictionaryPt,
  ru: dictionaryRu,
  "zh-cn": undefined,
  "zh-tw": undefined,
};

export function getLocaleDictionary(path: string): Dictionary {
  return dictionaryMapper[path];
}

export function getLocale(path: string, localeConfig: LocaleConfig): string {
  const normalizedPath = ensureTrailingSlash(ensureLeadingSlash(path));

  for (const locale of localeConfig.locales) {
    if (normalizedPath.startsWith(`/${locale}/`)) {
      return locale;
    }
  }

  return localeConfig.defaultLocale !== "" ? localeConfig.defaultLocale : "en";
}

export interface LocaleConfig {
  defaultLocale: string;
  locales: string[];
}
