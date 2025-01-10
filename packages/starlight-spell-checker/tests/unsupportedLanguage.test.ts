import { expect, test } from 'vitest'

import { buildFixture, expectValidationUnsupportedLanguage } from './utils'

test('builds with unsupported language, but warnings', async () => {
  const { output, status } = await buildFixture('unsupported-language')

  expect(status).toBe('success')

  expectValidationUnsupportedLanguage(output, ['ar'])
})

test('builds with unsupported languages, but warnings', async () => {
  const { output, status } = await buildFixture('unsupported-languages')

  expect(status).toBe('success')

  expectValidationUnsupportedLanguage(output, ["ar", "ja"])
})

