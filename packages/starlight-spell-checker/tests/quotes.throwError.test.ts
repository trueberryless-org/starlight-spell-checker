import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with quotes throw error valid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with quotes throw error invalid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 2, 1)

  expectValidationErrors(output, '/', [
    ['withheld', ValidationErrorType.Quotes, "withheld", []],
    ['fed', ValidationErrorType.Quotes, "fed", []],
  ])
})
