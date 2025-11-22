import { defineCollection, z } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        banner: z.object({ content: z.string() }).default({
          content: '⚠️ This project is depricated and will be deleted and removed from NPM in 2026. 🚨',
        }),
      }),
    }),
  }),
}
