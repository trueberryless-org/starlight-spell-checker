import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with repeated words throw error valid English content', async () => {
  const { output, status } = await buildFixture('repeated-words-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with repeated words throw error invalid English content', async () => {
  const { output, status } = await buildFixture('repeated-words-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['it it', ValidationErrorType.RepeatedWords, "it", ["it"]],
    ['to to', ValidationErrorType.RepeatedWords, "to", ["to"]],
    ['the the', ValidationErrorType.RepeatedWords, "the", ["the"]],
  ])
})
