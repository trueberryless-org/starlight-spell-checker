import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with valid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-mode-straight-valid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 2, 1)

  expectValidationErrors(output, '/', [
    ['isn’t', ValidationErrorType.Contractions, ["isn't"]],
    ['o’clock', ValidationErrorType.Contractions, ["o'clock"]],
  ])
})

test('does not build with contractions throw error invalid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-mode-straight-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 2, 1)

  expectValidationErrors(output, '/', [
    ['isnt', ValidationErrorType.Contractions, ["isn't"]],
    ['oc’lock', ValidationErrorType.Contractions, ["o'clock"]],
  ])
})
