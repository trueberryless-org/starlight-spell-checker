import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";

export default defineConfig({
  integrations: [
    starlight({
      pagefind: false,
      plugins: [
        starlightSpellChecker({
          exclude: ["exclude-manually/", "exclude-pattern/*"],
        }),
      ],
      title: "Starlight Spell Checker Tests - exclude",
    }),
  ],
});
