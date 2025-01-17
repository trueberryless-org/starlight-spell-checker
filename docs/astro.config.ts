import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightSpellChecker from "starlight-spell-checker";
import starlightPluginsDocsComponents from "@trueberryless-org/starlight-plugins-docs-components";

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl:
          "https://github.com/trueberryless-org/starlight-spell-checker/edit/main/docs/",
      },
      logo: {
        light: "./src/assets/logo-light.png",
        dark: "./src/assets/logo-dark.png",
        replacesTitle: true,
      },
      defaultLocale: "en",
      plugins: [
        starlightSpellChecker(),
        starlightPluginsDocsComponents({
          pluginName: "starlight-spell-checker",
        }),
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [{ slug: "getting-started" }, { slug: "configuration" }],
        },
      ],
      social: {
        github: "https://github.com/trueberryless-org/starlight-spell-checker",
      },
      title: "Starlight Spell Checker",
    }),
  ],
});
