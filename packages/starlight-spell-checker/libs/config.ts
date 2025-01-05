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
