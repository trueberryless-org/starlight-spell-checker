import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with valid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with contractions throw error invalid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['does’nt', ValidationErrorType.Contractions, ["doesn’t"]],
    ['yall', ValidationErrorType.Contractions, ["y’all"]],
    ['isnt', ValidationErrorType.Contractions, ["isn’t"]],
  ])
})
