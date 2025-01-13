import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with contractions throw error valid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with contractions throw error invalid English content', async () => {
  const { output, status } = await buildFixture('contractions-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 2, 1)

  expectValidationErrors(output, '/', [
    ['isnt', ValidationErrorType.Contractions, "missing-smart-apostrophe", ["isn’t"]],
    ['oc’lock', ValidationErrorType.Contractions, "missing-smart-apostrophe", ["o’clock"]],
  ])
})
