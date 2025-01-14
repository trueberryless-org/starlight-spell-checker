import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with quotes throw error smart config valid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-smart-config-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with quotes throw error smart config invalid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-smart-config-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 35, 1)

  expectValidationErrors(output, '/', [
    ['"', ValidationErrorType.Quotes, 'quote', ['«']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['›']],
    ['\'', ValidationErrorType.Quotes, 'apostrophe', ['’']],
    ['"', ValidationErrorType.Quotes, 'quote', ['»']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['«']],
    ['"', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['"', ValidationErrorType.Quotes, 'quote', ['›']],
    ['"', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['«']],
    ['‹', ValidationErrorType.Quotes, 'quote', ['«']],
    ['«', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['»', ValidationErrorType.Quotes, 'quote', ['›']],
    ['›', ValidationErrorType.Quotes, 'quote', ['»']],
    ['»', ValidationErrorType.Quotes, 'quote', ['›']],
    ['‹', ValidationErrorType.Quotes, 'quote', ['«']],
    ['«', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['"', ValidationErrorType.Quotes, 'quote', ['«']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['"', ValidationErrorType.Quotes, 'quote', ['«']],
    ['"', ValidationErrorType.Quotes, 'quote', ['»']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['›']],
    ['"', ValidationErrorType.Quotes, 'quote', ['»']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['«']],
    ['"', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['«']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['»']],
    ['"', ValidationErrorType.Quotes, 'quote', ['›']],
    ['\'', ValidationErrorType.Quotes, 'quote', ['»']],
    ['‹', ValidationErrorType.Quotes, 'quote', ['«']],
    ['«', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['‹', ValidationErrorType.Quotes, 'quote', ['«']],
    ['›', ValidationErrorType.Quotes, 'quote', ['»']],
    ['»', ValidationErrorType.Quotes, 'quote', ['›']],
    ['›', ValidationErrorType.Quotes, 'quote', ['»']],
  ]);
})
