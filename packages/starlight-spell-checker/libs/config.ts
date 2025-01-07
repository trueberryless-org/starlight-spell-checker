import { z } from "astro/zod";
import { AstroError } from "astro/errors";

const configSchema = z
  .object({
    /**
     * Defines a list of pages or glob patterns that should be excluded from validation.
     *
     * The pages in this list will be ignored by the plugin and will not be validated.
     *
     * @default []
     */
    exclude: z.array(z.string()).default([]),

    /**
     * Configuration for the assuming plugin.
     */
    assuming: z
      .object({
        /**
         * Whether to enable the assuming plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if unhelpful phrases are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),

        /**
         * Defines a list of phrases that should be checked against.
         *
         * The plugin has an internal list used by default.
         */
        phrases: z.array(z.string()).optional(),

        /**
         * Defines a list of words that should be ignored by the spell checker.
         *
         * The words in this list will be ignored by the spell checker and will not be considered as misspelled.
         *
         * @default []
         */
        ignore: z.array(z.string()).default([]),

        /**
         * Defines whether the plugin should also check for inverted assumptions that are probably fine.
         *
         * @default false
         */
        verbose: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the casePolice plugin.
     */
    casePolice: z
      .object({
        /**
         * Whether to enable the casePolice plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if popular names casings are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the contractions plugin.
     */
    contractions: z
      .object({
        /**
         * Whether to enable the contractions plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if apostrophe use in contractions are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the diacritics plugin.
     */
    diacritics: z
      .object({
        /**
         * Whether to enable the diacritics plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if diacritics are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the equality plugin.
     */
    equality: z
      .object({
        /**
         * Whether to enable the equality plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if insensitive, inconsiderate language are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the indefiniteArticle plugin.
     */
    indefiniteArticle: z
      .object({
        /**
         * Whether to enable the indefiniteArticle plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if indefinite articles are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the intensify plugin.
     */
    intensify: z
      .object({
        /**
         * Whether to enable the intensify plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if weak, mitigaing wordings are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the overuse plugin.
     */
    overuse: z
      .object({
        /**
         * Whether to enable the overuse plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if overused words are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the passive plugin.
     */
    passive: z
      .object({
        /**
         * Whether to enable the passive plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if passive voice are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the profanities plugin.
     */
    profanities: z
      .object({
        /**
         * Whether to enable the profanities plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if profane, vulgar wordings are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the readability plugin.
     */
    readability: z
      .object({
        /**
         * Whether to enable the readability plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if readability issues are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the redundantAcronyms plugin.
     */
    redundantAcronyms: z
      .object({
        /**
         * Whether to enable the redundantAcronyms plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if redundant acronyms are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the repeatedWords plugin.
     */
    repeatedWords: z
      .object({
        /**
         * Whether to enable the repeatedWords plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if repeated words are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the simplify plugin.
     */
    simplify: z
      .object({
        /**
         * Whether to enable the simplify plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if simplifiable words are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the usage plugin.
     */
    usage: z
      .object({
        /**
         * Whether to enable the usage plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if incorrect English usage issues are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the quotes plugin.
     */
    quotes: z
      .object({
        /**
         * Whether to enable the quotes plugin.
         *
         * @default false
         */
        enabled: z.boolean().default(false),

        /**
         * Defines whether the plugin should throw an error if quote and apostrophe usage issuges are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),
      })
      .default({}),

    /**
     * Configuration for the spell checker plugin.
     */
    spell: z
      .object({
        /**
         * Whether to enable the spell checker plugin.
         *
         * @default true
         */
        enabled: z.boolean().default(true),

        /**
         * Defines whether the plugin should throw an error if misspellings are found.
         *
         * When set to `false`, the plugin will log warnings and continue the build process.
         * When set to `true`, the plugin will throw an error and stop the build process.
         *
         * @default false
         */
        throwError: z.boolean().default(false),

        /**
         * Defines a list of words that should be ignored by the spell checker.
         *
         * The words in this list will be ignored by the spell checker and will not be considered as misspelled.
         *
         * @default []
         */
        ignore: z.array(z.string()).default([]),

        /**
         * Whether to ignore [literal words](https://github.com/syntax-tree/nlcst-is-literal).
         *
         * @default true
         */
        ignoreLiterals: z.boolean().default(true),

        /**
         * Whether to ignore “words” that contain digits or times such as `123456` or `2:41pm`.
         *
         * @default true
         */
        ignoreDigits: z.boolean().default(true),

        /**
         * Number of times to suggest.
         *
         * Further misspellings do not get suggestions.
         *
         * @default 30
         */
        max: z.number().default(30),
      })
      .default({}),
  })
  .default({});

export function validateConfig(
  userConfig: unknown
): StarlightSpellCheckerConfig {
  const config = configSchema.safeParse(userConfig);

  if (!config.success) {
    const errors = config.error.flatten();

    throw new AstroError(
      `Invalid starlight-spell-checker configuration:
      
      ${errors.formErrors.map((formError) => ` - ${formError}`).join("\n")}
      ${Object.entries(errors.fieldErrors)
        .map(
          ([fieldName, fieldErrors]) =>
            ` - ${fieldName}: ${fieldErrors.join(" - ")}`
        )
        .join("\n")}
        `,
      `See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at https://github.com/trueberryless-org/starlight-spell-checker/issues/new`
    );
  }

  return config.data;
}

export type StarlightSpellCheckerUserConfig = z.input<typeof configSchema>;
export type StarlightSpellCheckerConfig = z.output<typeof configSchema>;
