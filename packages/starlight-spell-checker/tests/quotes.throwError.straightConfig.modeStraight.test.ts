import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with quotes throw error straight config mode straight valid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-straight-config-mode-straight-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with quotes throw error straight config mode straight invalid English content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-straight-config-mode-straight-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 37, 1)

  expectValidationErrors(output, '/', [
    ['"', ValidationErrorType.Quotes, 'quote', ["'"]],
    ["'", ValidationErrorType.Quotes, 'quote', ['"']],
    ["'", ValidationErrorType.Quotes, 'quote', ['"']],
    ['"', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['“', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['‘', ValidationErrorType.Quotes, 'quote', ['"']],
    ['’', ValidationErrorType.Quotes, 'quote', ['"']],
    ['’', ValidationErrorType.Quotes, 'apostrophe', ["'"]],
    ['”', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['‘', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['“', ValidationErrorType.Quotes, 'quote', ['"']],
    ['”', ValidationErrorType.Quotes, 'quote', ['"']],
    ['”', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['’', ValidationErrorType.Quotes, 'apostrophe', ["'"]],
    ['”', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['’', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['‘', ValidationErrorType.Quotes, 'quote', ['"']],
    ['‘', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['“', ValidationErrorType.Quotes, 'quote', ['"']],
    ['"', ValidationErrorType.Quotes, 'quote', ["'"]],
    ["'", ValidationErrorType.Quotes, 'quote', ['"']],
    ['"', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['"', ValidationErrorType.Quotes, 'quote', ["'"]],
    ["'", ValidationErrorType.Quotes, 'quote', ['"']],
    ['"', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['“', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['‘', ValidationErrorType.Quotes, 'quote', ['"']],
    ['“', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['”', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['’', ValidationErrorType.Quotes, 'quote', ['"']],
    ['”', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['‘', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['“', ValidationErrorType.Quotes, 'quote', ['"']],
    ['‘', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['’', ValidationErrorType.Quotes, 'quote', ["'"]],
    ['”', ValidationErrorType.Quotes, 'quote', ['"']],
    ['’', ValidationErrorType.Quotes, 'quote', ["'"]],
  ]);
})
