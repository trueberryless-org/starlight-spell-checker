import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with usage throw error valid English content', async () => {
  const { output, status } = await buildFixture('usage-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with usage throw error invalid English content', async () => {
  const { output, status } = await buildFixture('usage-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['ad nauseum', ValidationErrorType.Usage, "ad-nauseum", ["ad nauseam"]],
    ['ATM machine', ValidationErrorType.Usage, "atm-machine", ["ATM"]],
    ['majorly', ValidationErrorType.Usage, "majorly", ["extremely"]],
  ])
})
