import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with valid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-mode-straight-valid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['doesn’t', ValidationErrorType.Contractions, ["doesn't"]],
    ['y’all', ValidationErrorType.Contractions, ["y'all"]],
    ['isn’t', ValidationErrorType.Contractions, ["isn't"]],
  ])
})

test('does not build with contractions throw error invalid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-mode-straight-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['does’nt', ValidationErrorType.Contractions, ["doesn’t"]],
    ['yall', ValidationErrorType.Contractions, ["y’all"]],
    ['isnt', ValidationErrorType.Contractions, ["isn’t"]],
  ])
})
