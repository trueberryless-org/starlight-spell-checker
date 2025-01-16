import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with profanities throw error sureness 2 valid Multilingual content', async () => {
  const { output, status } = await buildFixture('profanities-throw-error-sureness-2-valid-content-multilingual')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with profanities throw error sureness 2 invalid Multilingual content', async () => {
  const { output, status } = await buildFixture('profanities-throw-error-sureness-2-invalid-content-multilingual')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 2, 1)
  
  expectValidationErrors(output, 'fr/', [
    ['botter le cul', ValidationErrorType.Profanities, "botter-le-cul", []],
    ['cul', ValidationErrorType.Profanities, "cul", []],
  ])
})
