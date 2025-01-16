import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with simplify throw error valid English content', async () => {
  const { output, status } = await buildFixture('simplify-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with simplify throw error invalid English content', async () => {
  const { output, status } = await buildFixture('simplify-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 3, 1)

  expectValidationErrors(output, '/', [
    ['utilize', ValidationErrorType.Simplify, "utilize", ["use"]],
    ['Be advised', ValidationErrorType.Simplify, "be-advised", []],
    ['appropriate', ValidationErrorType.Simplify, "appropriate", ["proper", "right"]],
  ])
})
