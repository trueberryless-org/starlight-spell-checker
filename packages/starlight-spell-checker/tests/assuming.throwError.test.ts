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

  expectValidationErrorCount(output, 6, 1)

  expectValidationErrors(output, '/', [
    ['diped', ValidationErrorType.Assuming, ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Assuming, ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Assuming, ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Assuming, ["evading", "evening"]],
    ['breze', ValidationErrorType.Assuming, ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Assuming, ["though", "through", "thrush"]],
  ])
})
