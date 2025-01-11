import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with indefinite article throw error valid English content', async () => {
  const { output, status } = await buildFixture('indefinite-article-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with indefinite article throw error invalid English content', async () => {
  const { output, status } = await buildFixture('indefinite-article-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['a', ValidationErrorType.IndefiniteArticle, ["an"]],
    ['a', ValidationErrorType.IndefiniteArticle, ["an"]],
    ['an', ValidationErrorType.IndefiniteArticle, ["a"]],
  ])
})
