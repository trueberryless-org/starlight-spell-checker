import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationSuccess, expectValidationWarningCount, expectValidationWarnings } from './utils'

test('builds with valid English content', async () => {
  const { output, status } = await buildFixture('valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with valid German content', async () => {
  const { output, status } = await buildFixture('valid-content-de')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with valid French content', async () => {
  const { output, status } = await buildFixture('valid-content-fr')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with valid Multilingual content', async () => {
  const { output, status } = await buildFixture('valid-content-multilingual')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with invalid English content, but warnings', async () => {
  const { output, status } = await buildFixture('invalid-content')

  expect(status).toBe('success')

  expectValidationWarningCount(output, 6, 1)

  expectValidationWarnings(output, 'test/', [
    ['diped', ValidationErrorType.Spell, ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Spell, ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Spell, ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Spell, ["evading", "evening"]],
    ['breze', ValidationErrorType.Spell, ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Spell, ["though", "through", "thrush"]],
  ])
})

test('builds with invalid German content, but warnings', async () => {
  const { output, status } = await buildFixture('invalid-content-de')

  expect(status).toBe('success')

  expectValidationWarningCount(output, 6, 1)

  expectValidationWarnings(output, 'test/', [
    ['tachte', ValidationErrorType.Spell, ["dachte", "fachte", "pachte", "wachte", "takte", "-achte", "achte", "lachte", "machte", "sachte", "tauchte", "trachte"]],
    ['Horisont', ValidationErrorType.Spell, ["Horizont"]],
    ['Tönnen', ValidationErrorType.Spell, ["Tönen", "Gönnen", "Können", "Tannen", "Tennen", "Tonnen", "Tönten"]],
    ['Briese', ValidationErrorType.Spell, ["Brise", "Briefe", "Friese", "Priese", "Riese", "-riese"]],
    ['Abbends', ValidationErrorType.Spell, ["Abends"]],
    ['durh', ValidationErrorType.Spell, ["durch", "Dur"]],
  ])
})

test('builds with invalid French content, but warnings', async () => {
  const { output, status } = await buildFixture('invalid-content-fr')

  expect(status).toBe('success')

  expectValidationWarningCount(output, 6, 1)

  expectValidationWarnings(output, 'test/', [
    ['ploungé', ValidationErrorType.Spell, ["plongé"]],
    ['l\'horison', ValidationErrorType.Spell, ["l’horizon", "l’horion"]],
    ['tientes', ValidationErrorType.Spell, ["fientes", "teintes", "tentes", "tiennes", "tintes"]],
    ['briese', ValidationErrorType.Spell, ["briefe", "bries", "brise"]],
    ['sior', ValidationErrorType.Spell, ["sir", "soir", "Dior", "Sion"]],
    ['tràvers', ValidationErrorType.Spell, ["travers"]],
  ])
})

test('builds with invalid Multilingual content, but warnings', async () => {
  const { output, status } = await buildFixture('invalid-content-multilingual')

  expect(status).toBe('success')

  expectValidationWarningCount(output, 18, 3)

  expectValidationWarnings(output, 'test/', [
    ['diped', ValidationErrorType.Spell, ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Spell, ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Spell, ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Spell, ["evading", "evening"]],
    ['breze', ValidationErrorType.Spell, ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Spell, ["though", "through", "thrush"]],
  ])
  
  expectValidationWarnings(output, 'de/test/', [
    ['tachte', ValidationErrorType.Spell, ["dachte", "fachte", "pachte", "wachte", "takte", "-achte", "achte", "lachte", "machte", "sachte", "tauchte", "trachte"]],
    ['Horisont', ValidationErrorType.Spell, ["Horizont"]],
    ['Tönnen', ValidationErrorType.Spell, ["Tönen", "Gönnen", "Können", "Tannen", "Tennen", "Tonnen", "Tönten"]],
    ['Briese', ValidationErrorType.Spell, ["Brise", "Briefe", "Friese", "Priese", "Riese", "-riese"]],
    ['Abbends', ValidationErrorType.Spell, ["Abends"]],
    ['durh', ValidationErrorType.Spell, ["durch", "Dur"]],
  ])
  
  expectValidationWarnings(output, 'fr/test/', [
    ['ploungé', ValidationErrorType.Spell, ["plongé"]],
    ['l\'horison', ValidationErrorType.Spell, ["l’horizon", "l’horion"]],
    ['tientes', ValidationErrorType.Spell, ["fientes", "teintes", "tentes", "tiennes", "tintes"]],
    ['briese', ValidationErrorType.Spell, ["briefe", "bries", "brise"]],
    ['sior', ValidationErrorType.Spell, ["sir", "soir", "Dior", "Sion"]],
    ['tràvers', ValidationErrorType.Spell, ["travers"]],
  ])
})