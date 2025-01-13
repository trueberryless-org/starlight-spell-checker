import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with redundant acronyms throw error valid English content', async () => {
  const { output, status } = await buildFixture('redundant-acronyms-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with redundant acronyms throw error invalid English content', async () => {
  const { output, status } = await buildFixture('redundant-acronyms-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 1, 1)

  expectValidationErrors(output, '/', [
    ['ATM machine', ValidationErrorType.RedundantAcronyms, "atm", ["ATM"]],
  ])
})
