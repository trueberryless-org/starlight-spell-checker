import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with quotes throw error valid Multilingual content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-valid-content-multilingual')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with quotes throw error invalid Mulilingual content', async () => {
  const { output, status } = await buildFixture('quotes-throw-error-invalid-content-multilingual')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 7, 3)

  expectValidationErrors(output, '/', [
    ['‘', ValidationErrorType.Quotes, 'quote', ['“']],
    ['’', ValidationErrorType.Quotes, 'quote', ['”']],
  ]);

  expectValidationErrors(output, 'de/', [
      ['‚', ValidationErrorType.Quotes, 'quote', ['„']],
      ['‘', ValidationErrorType.Quotes, 'quote', ['“']],
  ]);

  expectValidationErrors(output, 'fr/', [
      ['“', ValidationErrorType.Quotes, 'quote', ['«']],
      ['”', ValidationErrorType.Quotes, 'quote', ['»']],
      ['“', ValidationErrorType.Quotes, 'quote', ['«']],
  ]);
})
