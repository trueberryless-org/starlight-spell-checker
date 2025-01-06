import { fileURLToPath } from "node:url";
import { statSync } from "node:fs";

import type { StarlightUserConfig as StarlightUserConfigWithPlugins } from "@astrojs/starlight/types";
import type { AstroConfig, AstroIntegrationLogger } from "astro";
import { $, bgGreen, black, blue, dim, green, red } from "kleur/colors";

import type { StarlightSpellCheckerConfig } from "../libs/config";

import { retext } from "retext";
import { getLocaleDictionary } from "./i18n";
import { stripLeadingSlash } from "./path";
import { getValidationData } from "./remark";

import retextAssuming from "retext-assuming";
import retextCasePolice from "retext-case-police";
import retextCliches from "retext-cliches";
import retextContractions from "retext-contractions";
import retextDiacritics from "retext-diacritics";
import retextEquality from "retext-equality";
import retextIndefiniteArticle from "retext-indefinite-article";
import retextIntensify from "retext-intensify";
import retextOveruse from "retext-overuse";
import retextPassive from "retext-passive";
import retextProfanities from "retext-profanities";
import retextReadability from "retext-readability";
import retextRedundantAcronyms from "retext-redundant-acronyms";
import retextRepeatedWords from "retext-repeated-words";
import retextSimplify from "retext-simplify";
import retextSpell from "retext-spell";
import retextUsage from "retext-usage";
import retextQuotes from "retext-quotes";

export const ValidationErrorType = {
  Assuming: "unhelpful phrase",
  CasePolice: "popular names casing",
  Cliches: "cliché",
  Contractions: "apostrophe use in contractions",
  Diacritics: "diacritics",
  Equality: "insensitive, inconsiderate language",
  IndefiniteArticle: "indefinite article",
  Intensify: "weak, mitigating wording",
  Overuse: "overused word",
  Passive: "passive voice",
  Profanities: "profane, vulgar wording",
  Readability: "readability",
  RedundantAcronyms: "redundant acronym",
  RepeatedWords: "repeated word",
  Simplify: "simpler alternative",
  Spell: "misspelled word",
  Usage: "incorrect English usage",
  Quotes: "quote and apostrophe usage",
  Other: "other",
} as const;

export async function validateTexts(
  pages: PageData[],
  outputDir: URL,
  astroConfig: AstroConfig,
  starlightConfig: StarlightUserConfig,
  options: StarlightSpellCheckerConfig
) {
  process.stdout.write(`\n${bgGreen(black(` validating spelling `))}\n`);

  const { contents } = getValidationData();

  const errors: ValidationErrors = new Map();

  for (const [filePath, content] of contents) {
    let dictionary = getLocaleDictionary(filePath, starlightConfig);

    let retextProcessor = retext()
      .use(retextAssuming)
      .use(retextCasePolice)
      .use(retextCliches)
      .use(retextContractions)
      .use(retextDiacritics)
      .use(retextEquality)
      .use(retextIndefiniteArticle)
      .use(retextIntensify)
      .use(retextOveruse)
      .use(retextPassive)
      .use(retextProfanities)
      .use(retextReadability)
      .use(retextRedundantAcronyms)
      .use(retextRepeatedWords)
      .use(retextSimplify)
      .use(retextSpell, {
        dictionary,
      })
      .use(retextUsage)
      .use(retextQuotes);

    try {
      const file = await retextProcessor.process(content);

      let fileErrors: ValidationError[] = [];

      for (const error of file.messages.values()) {
        fileErrors.push({
          word: error.actual ?? "",
          type: validationErrorTypeMapper[error.source ?? "other"],
          suggestions: error.expected ?? [],
        });
      }

      errors.set(filePath, fileErrors);
    } catch (err) {
      console.error(`Error processing file ${filePath}:`, err);
    }
  }

  return errors;
}

export function logErrors(
  pluginLogger: AstroIntegrationLogger,
  errors: Map<string, any>
) {
  const logger = pluginLogger.fork("");

  if (errors.size === 0) {
    logger.info(green("✓ All words spelled correctly.\n"));
    return;
  }

  const errorCount = [...errors.values()].reduce(
    (acc, links) => acc + links.length,
    0
  );

  logger.error(
    red(
      `✗ Found ${errorCount} misspelled ${pluralize(errorCount, "word")} in ${
        errors.size
      } ${pluralize(errors.size, "file")}.`
    )
  );

  for (const [file, validationErrors] of errors) {
    logger.info(`${red("▶")} ${blue(file)}`);

    for (const [index, validationError] of validationErrors.entries()) {
      logger.info(
        `  ${blue(`${index < validationErrors.length - 1 ? "├" : "└"}─`)} ${
          validationError.word
        }${dim(` - ${validationError.type}`)}${
          validationError.suggestions
            ? validationError.suggestions.length > 0
              ? ` (${validationError.suggestions.join(", ")})`
              : " no suggestions"
            : ""
        }`
      );
    }
  }

  process.stdout.write("\n");
}

/**
 * Check if a link is a valid asset in the build output directory.
 */
function isValidAsset(path: string, astroConfig: AstroConfig, outputDir: URL) {
  if (astroConfig.base !== "/") {
    const base = stripLeadingSlash(astroConfig.base);

    if (path.startsWith(base)) {
      path = path.replace(new RegExp(`^${stripLeadingSlash(base)}/?`), "");
    } else {
      return false;
    }
  }

  try {
    const filePath = fileURLToPath(new URL(path, outputDir));
    const stats = statSync(filePath);
    console.log(filePath);

    return stats.isFile();
  } catch {
    return false;
  }
}

function pluralize(count: number, singular: string) {
  return count === 1 ? singular : `${singular}s`;
}

/**
 * Check if a page is excluded from validation by the user.
 */
// function isExcludedPage(page: string, exclude: string[]) {
//   return picomatch(exclude)(page);
// }

type ValidationErrors = Map<string, ValidationError[]>;

export type ValidationErrorType =
  (typeof ValidationErrorType)[keyof typeof ValidationErrorType];

interface ValidationError {
  word: string;
  type: ValidationErrorType;
  suggestions?: string[];
}

const validationErrorTypeMapper: Record<string, any> = {
  "retext-assuming": ValidationErrorType.Assuming,
  "retext-case-police": ValidationErrorType.CasePolice,
  "retext-cliches": ValidationErrorType.Cliches,
  "retext-contractions": ValidationErrorType.Contractions,
  "retext-diacritics": ValidationErrorType.Diacritics,
  "retext-equality": ValidationErrorType.Equality,
  "retext-indefinite-article": ValidationErrorType.IndefiniteArticle,
  "retext-intensify": ValidationErrorType.Intensify,
  "retext-overuse": ValidationErrorType.Overuse,
  "retext-passive": ValidationErrorType.Passive,
  "retext-profanities": ValidationErrorType.Profanities,
  "retext-readability": ValidationErrorType.Readability,
  "retext-redundant-acronyms": ValidationErrorType.RedundantAcronyms,
  "retext-repeated-words": ValidationErrorType.RepeatedWords,
  "retext-simplify": ValidationErrorType.Simplify,
  "retext-spell": ValidationErrorType.Spell,
  "retext-usage": ValidationErrorType.Usage,
  "retext-quotes": ValidationErrorType.Quotes,
  other: ValidationErrorType.Other,
};

interface PageData {
  pathname: string;
}

type Pages = Set<PageData["pathname"]>;

export type StarlightUserConfig = Omit<
  StarlightUserConfigWithPlugins,
  "plugins"
>;
