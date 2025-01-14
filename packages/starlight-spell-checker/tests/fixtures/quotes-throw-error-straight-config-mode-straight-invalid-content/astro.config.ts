import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";

export default defineConfig({
  integrations: [
    starlight({
      pagefind: false,
      plugins: [
        starlightSpellChecker({
          quotes: {
            enabled: true,
            throwError: true,
            mode: "straight",
            straight: ["'", '"'],
          },
          spell: {
            enabled: false,
          },
        }),
      ],
      title:
        "Starlight Spell Checker Tests - quotes throw error straight config mode straight invalid content",
    }),
  ],
});
