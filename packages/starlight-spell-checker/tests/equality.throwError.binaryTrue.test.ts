import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with equality throw error binary true valid English content', async () => {
  const { output, status } = await buildFixture('equality-throw-error-binary-true-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with equality throw error binary true invalid English content', async () => {
  const { output, status } = await buildFixture('equality-throw-error-binary-true-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 1, 1)

  expectValidationErrors(output, '/', [
    ['obviously', ValidationErrorType.Equality, []],
  ])
})
