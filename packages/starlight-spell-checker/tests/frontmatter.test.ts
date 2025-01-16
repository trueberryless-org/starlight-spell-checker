import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationWarningCount, expectValidationWarnings } from './utils'

test('builds with invalid content frontmatter, but warnings', async () => {
  const { output, status } = await buildFixture('invalid-content-frontmatter')

  expect(status).toBe('success')

  expectValidationWarningCount(output, 5, 1)

  expectValidationWarnings(output, 'test/', [
    ['Frontmater', ValidationErrorType.Spell, "frontmater", []],
    ['heus', ValidationErrorType.Spell, "heus", ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['someting', ValidationErrorType.Spell, "someting", ["something"]],
    ['evaning', ValidationErrorType.Spell, "evaning", ["evading", "evening"]],
    ['toturial', ValidationErrorType.Spell, "toturial", ["tutorial"]],
  ])
})
