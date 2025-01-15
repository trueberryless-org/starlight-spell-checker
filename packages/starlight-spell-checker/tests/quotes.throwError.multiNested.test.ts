import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with quotes throw error multi nested valid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-multi-nested-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with quotes throw error multi multi nested valid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-multi-multi-nested-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with quotes throw error multi nested invalid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-multi-nested-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 32, 1)

  expectValidationErrors(output, '/', [
    ['“', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['‘', ValidationErrorType.Quotes, 'quote', ['“']],
    ['’', ValidationErrorType.Quotes, 'quote', ['”']],
    ['”', ValidationErrorType.Quotes, 'quote', ['›']],
    ['‘', ValidationErrorType.Quotes, 'quote', ['“']],
    ['“', ValidationErrorType.Quotes, 'quote', ['‘']],
    ['”', ValidationErrorType.Quotes, 'quote', ['’']],
    ['’', ValidationErrorType.Quotes, 'quote', ['”']],
    ['‘', ValidationErrorType.Quotes, 'quote', ['“']],
    ['“', ValidationErrorType.Quotes, 'quote', ['‘']],
    ['‘', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['’', ValidationErrorType.Quotes, 'quote', ['›']],
    ['”', ValidationErrorType.Quotes, 'quote', ['’']],
    ['’', ValidationErrorType.Quotes, 'quote', ['”']],
    ['«', ValidationErrorType.Quotes, 'quote', ['“']],
    ['‹', ValidationErrorType.Quotes, 'quote', ['‘']],
    ['“', ValidationErrorType.Quotes, 'quote', ['«']],
    ['‘', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['«', ValidationErrorType.Quotes, 'quote', ['“']],
    ['»', ValidationErrorType.Quotes, 'quote', ['”']],
    ['’', ValidationErrorType.Quotes, 'quote', ['›']],
    ['”', ValidationErrorType.Quotes, 'quote', ['»']],
    ['›', ValidationErrorType.Quotes, 'quote', ['’']],
    ['»', ValidationErrorType.Quotes, 'quote', ['”']],
    ['«', ValidationErrorType.Quotes, 'quote', ['“']],
    ['“', ValidationErrorType.Quotes, 'quote', ['‘']],
    ['‘', ValidationErrorType.Quotes, 'quote', ['«']],
    ['«', ValidationErrorType.Quotes, 'quote', ['‹']],
    ['»', ValidationErrorType.Quotes, 'quote', ['›']],
    ['’', ValidationErrorType.Quotes, 'quote', ['»']],
    ['”', ValidationErrorType.Quotes, 'quote', ['’']],
    ['»', ValidationErrorType.Quotes, 'quote', ['”']],
  ]);
})
