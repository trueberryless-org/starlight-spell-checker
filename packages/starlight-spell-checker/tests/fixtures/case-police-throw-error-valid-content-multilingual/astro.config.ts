import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";

export default defineConfig({
  integrations: [
    starlight({
      pagefind: false,
      plugins: [starlightSpellChecker({
        casePolice: {
          enabled: true,
          throwError: true,
        }
      })],
      title: "Starlight Spell Checker Tests - case police throw error valid content multilingual",
      locales: {
        root: {
          lang: "en",
          label: "English",
        },
        de: {
          lang: "de",
          label: "Deutsch",
        },
        fr: {
          lang: "fr",
          label: "Français",
        },
      },
    }),
  ],
});
