import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with spell throw error valid English content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-valid-content')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with spell throw error valid German content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-valid-content-de')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with spell throw error valid French content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-valid-content-fr')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('builds with spell throw error valid Multilingual content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-valid-content-multilingual')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with spell throw error invalid English content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-invalid-content')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 6, 1)

  expectValidationErrors(output, 'test/', [
    ['diped', ValidationErrorType.Spell, ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Spell, ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Spell, ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Spell, ["evading", "evening"]],
    ['breze', ValidationErrorType.Spell, ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Spell, ["though", "through", "thrush"]],
  ])
})

test('does not build with spell throw error invalid German content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-invalid-content-de')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 6, 1)

  expectValidationErrors(output, 'test/', [
    ['tachte', ValidationErrorType.Spell, ["dachte", "fachte", "pachte", "wachte", "takte", "-achte", "achte", "lachte", "machte", "sachte", "tauchte", "trachte"]],
    ['Horisont', ValidationErrorType.Spell, ["Horizont"]],
    ['Tönnen', ValidationErrorType.Spell, ["Tönen", "Gönnen", "Können", "Tannen", "Tennen", "Tonnen", "Tönten"]],
    ['Briese', ValidationErrorType.Spell, ["Brise", "Briefe", "Friese", "Priese", "Riese", "-riese"]],
    ['Abbends', ValidationErrorType.Spell, ["Abends"]],
    ['durh', ValidationErrorType.Spell, ["durch", "Dur"]],
  ])
})

test('does not build with spell throw error invalid French content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-invalid-content-fr')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 6, 1)

  expectValidationErrors(output, 'test/', [
    ['ploungé', ValidationErrorType.Spell, ["plongé"]],
    ['l\'horison', ValidationErrorType.Spell, ["l’horizon", "l’horion"]],
    ['tientes', ValidationErrorType.Spell, ["fientes", "teintes", "tentes", "tiennes", "tintes"]],
    ['briese', ValidationErrorType.Spell, ["briefe", "bries", "brise"]],
    ['sior', ValidationErrorType.Spell, ["sir", "soir", "Dior", "Sion"]],
    ['tràvers', ValidationErrorType.Spell, ["travers"]],
  ])
})

test('does not build with spell throw error invalid Multilingual content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-invalid-content-multilingual')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 18, 3)

  expectValidationErrors(output, 'test/', [
    ['diped', ValidationErrorType.Spell, ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Spell, ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Spell, ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Spell, ["evading", "evening"]],
    ['breze', ValidationErrorType.Spell, ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Spell, ["though", "through", "thrush"]],
  ])
  
  expectValidationErrors(output, 'de/test/', [
    ['tachte', ValidationErrorType.Spell, ["dachte", "fachte", "pachte", "wachte", "takte", "-achte", "achte", "lachte", "machte", "sachte", "tauchte", "trachte"]],
    ['Horisont', ValidationErrorType.Spell, ["Horizont"]],
    ['Tönnen', ValidationErrorType.Spell, ["Tönen", "Gönnen", "Können", "Tannen", "Tennen", "Tonnen", "Tönten"]],
    ['Briese', ValidationErrorType.Spell, ["Brise", "Briefe", "Friese", "Priese", "Riese", "-riese"]],
    ['Abbends', ValidationErrorType.Spell, ["Abends"]],
    ['durh', ValidationErrorType.Spell, ["durch", "Dur"]],
  ])
  
  expectValidationErrors(output, 'fr/test/', [
    ['ploungé', ValidationErrorType.Spell, ["plongé"]],
    ['l\'horison', ValidationErrorType.Spell, ["l’horizon", "l’horion"]],
    ['tientes', ValidationErrorType.Spell, ["fientes", "teintes", "tentes", "tiennes", "tintes"]],
    ['briese', ValidationErrorType.Spell, ["briefe", "bries", "brise"]],
    ['sior', ValidationErrorType.Spell, ["sir", "soir", "Dior", "Sion"]],
    ['tràvers', ValidationErrorType.Spell, ["travers"]],
  ])
})