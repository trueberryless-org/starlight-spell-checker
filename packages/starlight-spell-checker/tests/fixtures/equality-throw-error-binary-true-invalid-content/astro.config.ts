import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";

export default defineConfig({
  integrations: [
    starlight({
      pagefind: false,
      plugins: [
        starlightSpellChecker({
          equality: {
            enabled: true,
            throwError: true,
            binary: true,
          },
          spell: {
            enabled: false,
          },
        }),
      ],
      title:
        "Starlight Spell Checker Tests - equality throw error binary true invalid content",
    }),
  ],
});
