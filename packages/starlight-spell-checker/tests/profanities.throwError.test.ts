import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with profanities throw error valid Multilingual content', async () => {
  const { output, status } = await buildFixture('profanities-throw-error-valid-content-multilingual')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with profanities throw error invalid Multilingual content', async () => {
  const { output, status } = await buildFixture('profanities-throw-error-invalid-content-multilingual')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 5, 2)

  expectValidationErrors(output, '/', [
    ['butt', ValidationErrorType.Profanities, "butt", []],
    ['horny', ValidationErrorType.Profanities, "horny", []],
  ])
  
  expectValidationErrors(output, 'fr/', [
    ['botter le cul', ValidationErrorType.Profanities, "botter-le-cul", []],
    ['cul', ValidationErrorType.Profanities, "cul", []],
    ['bander', ValidationErrorType.Profanities, "bander", []],
  ])
})
