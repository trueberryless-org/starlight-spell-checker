import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightSpellChecker from 'starlight-spell-checker'

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/trueberryless-org/starlight-spell-checker/edit/main/docs/',
      },
      plugins: [starlightSpellChecker()],
      sidebar: [
        {
          label: 'Start Here',
          items: [{ slug: 'getting-started' }],
        },
      ],
      social: {
        github: 'https://github.com/trueberryless-org/starlight-spell-checker',
      },
      title: 'starlight-spell-checker',
    }),
  ],
})
