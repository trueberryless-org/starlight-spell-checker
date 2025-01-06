import { fileURLToPath } from "node:url";
import { statSync } from "node:fs";
import { posix } from "node:path";

import type { StarlightUserConfig as StarlightUserConfigWithPlugins } from "@astrojs/starlight/types";
import type { AstroConfig, AstroIntegrationLogger } from "astro";
import { $, bgGreen, black, blue, dim, green, red } from "kleur/colors";

import type { StarlightSpellCheckerConfig } from "../libs/config";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { retext } from "retext";
import retextSpell from "retext-spell";
import dictionaryEn from "dictionary-en";
import retextReadability from "retext-readability";
import retextIndefiniteArticle from "retext-indefinite-article";
import { visit } from "unist-util-visit";
import { promises as fs } from "fs";
import path from "path";
import type { Root } from "mdast";
import { getLocaleConfig, getLocaleDictionary } from "./i18n";
import { ensureTrailingSlash, stripLeadingSlash } from "./path";
import { reporter } from "vfile-reporter";
import { getValidationData } from "./remark";

export const ValidationErrorType = {
  Misspelling: "Misspelling",
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

    let retextProcessor = retext().use(retextSpell, {
      dictionary,
    });
    // .use(retextReadability, { age: 22 })
    // .use(retextIndefiniteArticle);

    try {
      const file = await retextProcessor.process(content);

      let fileErrors: ValidationError[] = [];

      for (const error of file.messages.values()) {
        fileErrors.push({
          word: error.actual ?? "",
          type: ValidationErrorType.Misspelling,
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

interface PageData {
  pathname: string;
}

type Pages = Set<PageData["pathname"]>;

export type StarlightUserConfig = Omit<
  StarlightUserConfigWithPlugins,
  "plugins"
>;
