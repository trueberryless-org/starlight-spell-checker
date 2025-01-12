import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with intensify throw error valid English content', async () => {
  const { output, status } = await buildFixture('intensify-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with intensify throw error invalid English content', async () => {
  const { output, status } = await buildFixture('intensify-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 5, 1)

  expectValidationErrors(output, '/', [
    ['Some', ValidationErrorType.Intensify, []],
    ['say', ValidationErrorType.Intensify, []],
    ['quite', ValidationErrorType.Intensify, []],
    ['some', ValidationErrorType.Intensify, []],
    ['apparently', ValidationErrorType.Intensify, []],
  ])
})
