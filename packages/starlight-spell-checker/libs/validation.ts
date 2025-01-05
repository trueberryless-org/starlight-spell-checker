import { statSync } from "node:fs";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";

import type { StarlightUserConfig as StarlightUserConfigWithPlugins } from "@astrojs/starlight/types";
import type { AstroConfig, AstroIntegrationLogger } from "astro";
import { bgGreen, black, blue, dim, green, red } from "kleur/colors";
import picomatch from "picomatch";

import type { StarlightSpellCheckerConfig } from "../libs/config";

import { getLocaleConfig, type LocaleConfig } from "./i18n";
import { ensureTrailingSlash, stripLeadingSlash } from "./path";

export const ValidationErrorType = {
  MisspelledWord: "misspelled word",
} as const;

export function validateTexts(
  pages: PageData[],
  outputDir: URL,
  astroConfig: AstroConfig,
  starlightConfig: StarlightUserConfig,
  options: StarlightSpellCheckerConfig
): ValidationErrors {
  process.stdout.write(`\n${bgGreen(black(` validating spelling `))}\n`);

  const localeConfig = getLocaleConfig(starlightConfig);
  const allPages: Pages = new Set(
    pages
      .map((page) =>
        ensureTrailingSlash(
          astroConfig.base === "/"
            ? stripLeadingSlash(page.pathname)
            : posix.join(stripLeadingSlash(astroConfig.base), page.pathname)
        )
      )
      .filter((page) => !isExcludedPage(page, options.exclude))
  );

  const errors: ValidationErrors = new Map();

  for (const page of allPages) {
    const validationContext: ValidationContext = {
      astroConfig,
      errors,
      localeConfig,
      options,
      outputDir,
      pages: allPages,
      currentPage: page,
    };

    validateText(validationContext);
  }

  return errors;
}

export function logErrors(
  pluginLogger: AstroIntegrationLogger,
  errors: ValidationErrors
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
          validationError.link
        }${dim(` - ${validationError.type}`)}`
      );
    }
  }

  process.stdout.write("\n");
}

/**
 * Validate a page.
 */
function validateText(context: ValidationContext) {
  const { astroConfig, errors, localeConfig, options, pages } = context;

  return;
}

/**
 * Check if a page is excluded from validation by the user.
 */
function isExcludedPage(page: string, exclude: string[]) {
  return picomatch(exclude)(page);
}

function stripQueryString(path: string): string {
  return path.split("?")[0] ?? path;
}

function addError(errors: ValidationErrors, type: ValidationErrorType) {
  const fileErrors = errors.get(filePath) ?? [];
  fileErrors.push({ link, type });

  errors.set(filePath, fileErrors);
}

function pluralize(count: number, singular: string) {
  return count === 1 ? singular : `${singular}s`;
}

// The validation errors keyed by file path.
type ValidationErrors = Map<string, ValidationError[]>;

export type ValidationErrorType =
  (typeof ValidationErrorType)[keyof typeof ValidationErrorType];

interface ValidationError {
  word: string;
  type: ValidationErrorType;
  suggestions: string[];
}

interface PageData {
  pathname: string;
}

type Page = PageData["pathname"];
type Pages = Set<Page>;

interface ValidationContext {
  astroConfig: AstroConfig;
  errors: ValidationErrors;
  localeConfig: LocaleConfig | undefined;
  options: StarlightSpellCheckerConfig;
  outputDir: URL;
  pages: Pages;
}

export type StarlightUserConfig = Omit<
  StarlightUserConfigWithPlugins,
  "plugins"
>;
