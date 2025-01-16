import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with assuming throw error valid English content', async () => {
  const { output, status } = await buildFixture('assuming-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with assuming throw error invalid English content', async () => {
  const { output, status } = await buildFixture('assuming-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 5, 1)

  expectValidationErrors(output, '/', [
    ['just', ValidationErrorType.Assuming, "no-just", []],
    ['simply', ValidationErrorType.Assuming, "no-simply", []],
    ['obviously', ValidationErrorType.Assuming, "no-obviously", []],
    ['actually', ValidationErrorType.Assuming, "no-actually", []],
    ['easy', ValidationErrorType.Assuming, "no-easy", []],
  ])
})
