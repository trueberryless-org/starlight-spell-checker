import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationWarningCount, expectValidationWarnings } from './utils'

test('builds with exclude, but warnings', async () => {
  const { output, status } = await buildFixture('exclude')

  expect(status).toBe('success')

  expectValidationWarningCount(output, 6, 1)

  expectValidationWarnings(output, 'test/', [
    ['diped', ValidationErrorType.Spell, "diped", ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Spell, "horison", ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Spell, "heus", ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Spell, "evaning", ["evading", "evening"]],
    ['breze', ValidationErrorType.Spell, "breze", ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Spell, "thrugh", ["though", "through", "thrush"]],
  ])
})
