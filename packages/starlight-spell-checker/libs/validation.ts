import type { StarlightUserConfig as StarlightUserConfigWithPlugins } from "@astrojs/starlight/types";
import type { AstroIntegrationLogger } from "astro";
import { $, bgGreen, black, blue, dim, green, red, yellow } from "kleur/colors";

import type { StarlightSpellCheckerConfig } from "../libs/config";

import { retext } from "retext";
import { getLocaleDictionary } from "./i18n";
import { getValidationData } from "./remark";
import picomatch from "picomatch";

import retextAssuming from "retext-assuming";
import retextCasePolice from "@trueberryless-org/retext-case-police";
// import retextCliches from "retext-cliches";
import retextContractions from "retext-contractions";
import retextDiacritics from "retext-diacritics";
import retextEquality from "retext-equality";
import retextIndefiniteArticle from "@trueberryless-org/retext-indefinite-article";
import retextIntensify from "retext-intensify";
// import retextOveruse from "retext-overuse";
import retextPassive from "retext-passive";
import retextProfanitiesAr from "retext-profanities/ar-latn";
import retextProfanitiesEn from "retext-profanities/en";
import retextProfanitiesEs from "retext-profanities/es";
import retextProfanitiesFr from "retext-profanities/fr";
import retextProfanitiesIt from "retext-profanities/it";
import retextProfanitiesPt from "retext-profanities/pt";
import retextReadability from "retext-readability";
import retextRedundantAcronyms from "retext-redundant-acronyms";
import retextRepeatedWords from "retext-repeated-words";
import retextSimplify from "retext-simplify";
import retextSpell from "retext-spell";
import retextUsage from "@trueberryless-org/retext-usage";
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

export async function validateTexts(options: StarlightSpellCheckerConfig) {
  process.stdout.write(`\n${bgGreen(black(` validating spelling `))}\n`);

  const { contents } = getValidationData();

  const errors: ValidationErrors = new Map();
  const warnings: ValidationErrors = new Map();
  const unsupportedLanguages: UnsupportedLanguageErrors = new Set();

  for (const [locale, files] of contents) {
    let dictionary = getLocaleDictionary(locale);

    if (!dictionary) {
      unsupportedLanguages.add({ locale });
      continue;
    }

    let retextProcessor = createProcessor(retext())
      .use(retextAssuming, options.assuming.enabled && locale === "en", {
        ...(options.assuming.phrases !== undefined && {
          phrases: options.assuming.phrases,
        }),
        ignore: options.assuming.ignore,
        verbose: options.assuming.verbose,
      })
      // .use(retextCliches)
      .use(
        retextContractions,
        options.contractions.enabled && locale === "en",
        {
          allowLiterals: !options.contractions.ignoreLiterals,
          straight: options.contractions.mode,
        }
      )
      .use(retextDiacritics, options.diacritics.enabled)
      .use(retextEquality, options.equality.enabled && locale === "en", {
        ignore: options.equality.ignore,
        binary: options.equality.binary,
      })
      .use(
        retextIndefiniteArticle,
        options.indefiniteArticle.enabled && locale === "en"
      )
      .use(retextIntensify, options.intensify.enabled && locale === "en", {
        ignore: options.intensify.ignore,
      })
      // .use(retextOveruse, options.overuse.enabled)
      .use(retextPassive, options.passive.enabled && locale === "en", {
        ignore: options.passive.ignore,
      })
      .use(
        profanityMapper[locale],
        options.profanities.enabled &&
          Object.keys(profanityMapper).includes(locale),
        {
          ignore: options.profanities.ignore,
          sureness: options.profanities.sureness,
        }
      )
      .use(retextReadability, options.readability.enabled && locale === "en", {
        age: options.readability.age,
        minWords: options.readability.minWords,
        threshold: options.readability.threshold,
      })
      .use(
        retextRedundantAcronyms,
        options.redundantAcronyms.enabled && locale === "en"
      )
      .use(retextRepeatedWords, options.repeatedWords.enabled)
      .use(retextSimplify, options.simplify.enabled && locale === "en", {
        ignore: options.simplify.ignore,
      })
      .use(retextSpell, options.spell.enabled, {
        dictionary,
        ignore: options.spell.ignore,
        ignoreLiterals: options.spell.ignoreLiterals,
        ignoreDigits: options.spell.ignoreDigits,
        max: options.spell.max,
      })
      .use(retextUsage, options.usage.enabled && locale === "en")
      .use(retextQuotes, options.quotes.enabled, {
        preferred: options.quotes.mode,
        smart: Array.isArray(options.quotes.smart)
          ? options.quotes.smart
          : options.quotes.smart[locale],
        straight: Array.isArray(options.quotes.straight)
          ? options.quotes.straight
          : options.quotes.straight[locale],
      })
      .use(retextCasePolice, options.casePolice.enabled, {
        ignore: options.casePolice.ignore,
      })
      .build();
    for (const [filePath, content] of files) {
      if (isExcludedPage(filePath, options.exclude)) {
        continue;
      }

      try {
        const file = await retextProcessor.process(content);

        let fileErrors: ValidationError[] = [];
        let fileWarnings: ValidationError[] = [];

        for (const error of file.messages.values()) {
          // console.log(error);
          const throwError = getThrowErrorForType(
            validationErrorTypeMapper[error.source ?? "other"],
            options
          );

          if (throwError) {
            fileErrors.push({
              word: error.actual ?? "",
              type: validationErrorTypeMapper[error.source ?? "other"],
              rule: error.ruleId ?? "",
              suggestions: error.expected ?? [],
            });
          } else {
            fileWarnings.push({
              word: error.actual ?? "",
              type: validationErrorTypeMapper[error.source ?? "other"],
              rule: error.ruleId ?? "",
              suggestions: error.expected ?? [],
            });
          }
        }

        if (fileErrors.length > 0) {
          errors.set(filePath, fileErrors);
        }
        if (fileWarnings.length > 0) {
          warnings.set(filePath, fileWarnings);
        }
      } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
      }
    }
  }

  return { warnings, errors, unsupportedLanguages };
}

export function logWarnings(
  pluginLogger: AstroIntegrationLogger,
  warnings: Map<string, any>
) {
  const logger = pluginLogger.fork("");

  if (warnings.size === 0) {
    return;
  }

  const warningCount = [...warnings.values()].reduce(
    (acc, links) => acc + links.length,
    0
  );

  logger.warn(
    yellow(
      `✗ Found ${warningCount} ${pluralize(warningCount, "warning")} in ${
        warnings.size
      } ${pluralize(warnings.size, "file")}.`
    )
  );

  for (const [file, validationWarnings] of warnings) {
    logger.info(`${yellow("▶")} ${blue(file)}`);

    for (const [index, validationWarning] of validationWarnings.entries()) {
      logger.info(
        `  ${blue(`${index < validationWarnings.length - 1 ? "├" : "└"}─`)} ${
          validationWarning.word
        }${dim(` - ${validationWarning.type} - ${validationWarning.rule}`)}${
          validationWarning.suggestions
            ? validationWarning.suggestions.length > 0
              ? ` (${validationWarning.suggestions.join(", ")})`
              : " no suggestions"
            : ""
        }`
      );
    }
  }

  process.stdout.write("\n");
}

export function logErrors(
  pluginLogger: AstroIntegrationLogger,
  errors: Map<string, any>
) {
  const logger = pluginLogger.fork("");

  if (errors.size === 0) {
    return;
  }

  const errorCount = [...errors.values()].reduce(
    (acc, links) => acc + links.length,
    0
  );

  logger.error(
    red(
      `✗ Found ${errorCount} ${pluralize(errorCount, "error")} in ${
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
        }${dim(` - ${validationError.type} - ${validationError.rule}`)}${
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

export function logUnsupportedLanguages(
  pluginLogger: AstroIntegrationLogger,
  unsupportedLanguages: UnsupportedLanguageErrors
) {
  const logger = pluginLogger.fork("");

  if (unsupportedLanguages.size == 0) {
    logger.info(green("✓ All languages supported.\n"));
  } else {
    logger.info(
      yellow(
        `✗ Unsupported ${pluralize(
          unsupportedLanguages.size,
          "language"
        )}: ${red(
          [...unsupportedLanguages]
            .map((error) => error.locale)
            .join(yellow(", "))
        )} (No ${
          unsupportedLanguages.size == 1 ? "dictionary" : "dictionaries"
        } available.)`
      )
    );
  }
}

/**
 * A wrapper around a retext processor to allow conditional plugin chaining.
 *
 * @param {Processor} processor - The retext processor instance.
 * @returns {Object} An object with a `use` method for conditional chaining and a `build` method to finalize.
 */
function createProcessor(processor) {
  return {
    /**
     * Conditionally adds a plugin to the processor.
     *
     * @param {Function} plugin - The plugin to add (e.g., retextAssuming).
     * @param {boolean} condition - Determines whether to apply the plugin.
     * @param {Object} [options] - Optional options to pass to the plugin.
     * @returns {Object} The same wrapper for chaining.
     */
    use(plugin, condition, options = {}) {
      if (condition) {
        processor = processor.use(plugin, options);
      }
      return this;
    },
    /**
     * Finalizes and returns the processor.
     *
     * @returns {Processor} The built retext processor instance.
     */
    build() {
      return processor;
    },
  };
}

function pluralize(count: number, singular: string) {
  return count === 1 ? singular : `${singular}s`;
}

/**
 * Check if a page is excluded from validation by the user.
 */
function isExcludedPage(page: string, exclude: string[]) {
  return picomatch(exclude)(page);
}

function getThrowErrorForType(
  errorType: ValidationErrorType,
  options: Record<string, any> // The validated options object from your config
): boolean | undefined {
  // Create a mapping between ValidationErrorType and option keys
  const errorTypeToOptionKey: Record<ValidationErrorType, string> = {
    [ValidationErrorType.Assuming]: "assuming",
    [ValidationErrorType.CasePolice]: "casePolice",
    [ValidationErrorType.Cliches]: "cliches",
    [ValidationErrorType.Contractions]: "contractions",
    [ValidationErrorType.Diacritics]: "diacritics",
    [ValidationErrorType.Equality]: "equality",
    [ValidationErrorType.IndefiniteArticle]: "indefiniteArticle",
    [ValidationErrorType.Intensify]: "intensify",
    [ValidationErrorType.Overuse]: "overuse",
    [ValidationErrorType.Passive]: "passive",
    [ValidationErrorType.Profanities]: "profanities",
    [ValidationErrorType.Readability]: "readability",
    [ValidationErrorType.RedundantAcronyms]: "redundantAcronyms",
    [ValidationErrorType.RepeatedWords]: "repeatedWords",
    [ValidationErrorType.Simplify]: "simplify",
    [ValidationErrorType.Spell]: "spell",
    [ValidationErrorType.Usage]: "usage",
    [ValidationErrorType.Quotes]: "quotes",
    [ValidationErrorType.Other]: "other",
  };

  // Find the corresponding option key for the given errorType
  const optionKey = errorTypeToOptionKey[errorType];
  if (!optionKey) return undefined; // Return undefined if no mapping exists

  // Access the options dynamically to get the `throwError` value
  return options[optionKey]?.throwError ?? undefined;
}

const profanityMapper: Record<string, any> = {
  ar: retextProfanitiesAr,
  en: retextProfanitiesEn,
  es: retextProfanitiesEs,
  fr: retextProfanitiesFr,
  it: retextProfanitiesIt,
  "pt-BR": retextProfanitiesPt,
};

type ValidationErrors = Map<string, ValidationError[]>;

export type ValidationErrorType =
  (typeof ValidationErrorType)[keyof typeof ValidationErrorType];

interface ValidationError {
  word: string;
  type: ValidationErrorType;
  rule: string;
  suggestions?: string[];
}

type UnsupportedLanguageErrors = Set<UnsupportedLanguageError>;

interface UnsupportedLanguageError {
  locale: string;
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
  "retext-profanities-ar-latn": ValidationErrorType.Profanities,
  "retext-profanities-ar": ValidationErrorType.Profanities,
  "retext-profanities-fr": ValidationErrorType.Profanities,
  "retext-profanities-en": ValidationErrorType.Profanities,
  "retext-profanities-es": ValidationErrorType.Profanities,
  "retext-profanities-it": ValidationErrorType.Profanities,
  "retext-profanities-pt": ValidationErrorType.Profanities,
  "retext-profanities-pt-pt": ValidationErrorType.Profanities,
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
