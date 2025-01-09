import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";

export default defineConfig({
  integrations: [
    starlight({
      pagefind: false,
      plugins: [
        starlightSpellChecker({
          spell: {
            throwError: true,
          },
        }),
      ],
      title:
        "Starlight Spell Checker Tests - spell throw error valid content fr",
      defaultLocale: "fr",
    }),
  ],
});
