import type { StarlightPlugin } from "@astrojs/starlight/types";
import { AstroError } from "astro/errors";
import { green } from "kleur/colors";

import { clearContentLayerCache } from "./libs/astro";
import {
  type StarlightSpellCheckerConfig,
  type StarlightSpellCheckerUserConfig,
  validateConfig,
} from "./libs/config";
import { remarkStarlightSpellChecker } from "./libs/remark";
import {
  logErrors,
  logUnsupportedLanguages,
  logWarnings,
  validateTexts,
} from "./libs/validation";

export { type StarlightSpellCheckerConfig };

export default function starlightSpellChecker(
  userConfig?: StarlightSpellCheckerUserConfig
): StarlightPlugin {
  const config = validateConfig(userConfig);

  return {
    name: "starlight-spell-checker",
    hooks: {
      "config:setup"({
        addIntegration,
        astroConfig,
        config: starlightConfig,
        logger,
      }) {
        addIntegration({
          name: "starlight-spell-checker-integration",
          hooks: {
            "astro:config:setup": async ({ command, updateConfig }) => {
              if (command !== "build") {
                return;
              }

              await clearContentLayerCache(astroConfig, logger);

              updateConfig({
                markdown: {
                  remarkPlugins: [
                    [
                      remarkStarlightSpellChecker,
                      {
                        base: astroConfig.base,
                        srcDir: astroConfig.srcDir,
                        starlightConfig: starlightConfig,
                      },
                    ],
                  ],
                  smartypants: false,
                },
              });
            },
            "astro:build:done": async () => {
              const { warnings, errors, unsupportedLanguages } =
                await validateTexts(config);

              logWarnings(logger, warnings);
              logErrors(logger, errors);
              logUnsupportedLanguages(logger, unsupportedLanguages);

              if (warnings.size <= 0 && errors.size <= 0) {
                logger.info(green("✓ All words spelled correctly.\n"));
              }

              if (errors.size > 0) {
                throwPluginError("Spelling validation failed.");
              }
            },
          },
        });
      },
    },
  };
}

function throwPluginError(message: string): never {
  throw new AstroError(
    message,
    `See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at https://github.com/trueberryless-org/starlight-spell-checker/issues/new`
  );
}
