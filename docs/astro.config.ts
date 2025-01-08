import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl:
          "https://github.com/trueberryless-org/starlight-spell-checker/edit/main/docs/",
      },
      locales: {
        root: {
          lang: "en",
          label: "English",
        },
        de: {
          lang: "de",
          label: "Deutsch",
        },
      },
      plugins: [
        starlightSpellChecker({
          spell: {
            ignore: ["astro.config.mjs"],
          },
        }),
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [{ slug: "getting-started" }],
        },
      ],
      social: {
        github: "https://github.com/trueberryless-org/starlight-spell-checker",
      },
      title: "starlight-spell-checker",
    }),
  ],
});
