import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with equality throw error valid English content', async () => {
  const { output, status } = await buildFixture('equality-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with equality throw error invalid English content', async () => {
  const { output, status } = await buildFixture('equality-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['obviously', ValidationErrorType.Equality, "obvious", []],
    ['Brother', ValidationErrorType.Equality, "brother-sister", ["Sibling"]],
    ['sister', ValidationErrorType.Equality, "brother-sister", ["sibling"]],
  ])
})
