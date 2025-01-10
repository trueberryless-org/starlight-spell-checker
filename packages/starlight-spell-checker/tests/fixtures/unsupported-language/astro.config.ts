import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";

export default defineConfig({
  integrations: [
    starlight({
      pagefind: false,
      plugins: [starlightSpellChecker()],
      title: "Starlight Spell Checker Tests - unsupported language",
      defaultLocale: "ar",
    }),
  ],
});
