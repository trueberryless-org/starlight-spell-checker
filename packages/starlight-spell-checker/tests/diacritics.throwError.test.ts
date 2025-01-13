import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with diacritics throw error valid English content', async () => {
  const { output, status } = await buildFixture('diacritics-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with diacritics throw error invalid English content', async () => {
  const { output, status } = await buildFixture('diacritics-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['Beyonce', ValidationErrorType.Diacritics, "beyonce", ["Beyoncé"]],
    ['creme fresh', ValidationErrorType.Diacritics, "creme-fresh", ["crème fraîche"]],
    ['his resume', ValidationErrorType.Diacritics, "his-resume", ["his résumé"]],
  ])
})
