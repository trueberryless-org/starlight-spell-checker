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
    ['diped', ValidationErrorType.Spell, "diped", ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Spell, "horison", ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Spell, "heus", ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Spell, "evaning", ["evading", "evening"]],
    ['breze', ValidationErrorType.Spell, "breze", ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Spell, "thrugh", ["though", "through", "thrush"]],
  ])
})

test('does not build with spell throw error invalid German content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-invalid-content-de')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 6, 1)

  expectValidationErrors(output, 'test/', [
    ['tachte', ValidationErrorType.Spell, "tachte", ["dachte", "fachte", "pachte", "wachte", "takte", "-achte", "achte", "lachte", "machte", "sachte", "tauchte", "trachte"]],
    ['Horisont', ValidationErrorType.Spell, "horisont", ["Horizont"]],
    ['Tönnen', ValidationErrorType.Spell, "t-nnen", ["Tönen", "Gönnen", "Können", "Tannen", "Tennen", "Tonnen", "Tönten"]],
    ['Briese', ValidationErrorType.Spell, "briese", ["Brise", "Briefe", "Friese", "Priese", "Riese", "-riese"]],
    ['Abbends', ValidationErrorType.Spell, "abbends", ["Abends"]],
    ['durh', ValidationErrorType.Spell, "durh", ["durch", "Dur"]],
  ])
})

test('does not build with spell throw error invalid French content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-invalid-content-fr')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 6, 1)

  expectValidationErrors(output, 'test/', [
    ['ploungé', ValidationErrorType.Spell, "ploung-", ["plongé"]],
    ['l\'horison', ValidationErrorType.Spell, "l-horison", ["l’horizon", "l’horion"]],
    ['tientes', ValidationErrorType.Spell, "tientes", ["fientes", "teintes", "tentes", "tiennes", "tintes"]],
    ['briese', ValidationErrorType.Spell, "briese", ["briefe", "bries", "brise"]],
    ['sior', ValidationErrorType.Spell, "sior", ["sir", "soir", "Dior", "Sion"]],
    ['tràvers', ValidationErrorType.Spell, "tr-vers", ["travers"]],
  ])
})

test('does not build with spell throw error invalid Multilingual content', async () => {
  const { output, status } = await buildFixture('spell-throw-error-invalid-content-multilingual')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 18, 3)

  expectValidationErrors(output, 'test/', [
    ['diped', ValidationErrorType.Spell, "diped", ["dipped", "doped", "duped", "biped", "diced", "died", "diked", "dined", "dived", "piped", "wiped"]],
    ['horison', ValidationErrorType.Spell, "horison", ["orison", "horizon", "Morison"]],
    ['heus', ValidationErrorType.Spell, "heus", ["hers", "hews", "he's", "hems", "hens", "hes", "hues", "Hess", "Hus", "Zeus"]],
    ['evaning', ValidationErrorType.Spell, "evaning", ["evading", "evening"]],
    ['breze', ValidationErrorType.Spell, "breze", ["breeze", "braze", "breve"]],
    ['thrugh', ValidationErrorType.Spell, "thrugh", ["though", "through", "thrush"]],
  ])
  
  expectValidationErrors(output, 'de/test/', [
    ['tachte', ValidationErrorType.Spell, "tachte", ["dachte", "fachte", "pachte", "wachte", "takte", "-achte", "achte", "lachte", "machte", "sachte", "tauchte", "trachte"]],
    ['Horisont', ValidationErrorType.Spell, "horisont", ["Horizont"]],
    ['Tönnen', ValidationErrorType.Spell, "t-nnen", ["Tönen", "Gönnen", "Können", "Tannen", "Tennen", "Tonnen", "Tönten"]],
    ['Briese', ValidationErrorType.Spell, "briese", ["Brise", "Briefe", "Friese", "Priese", "Riese", "-riese"]],
    ['Abbends', ValidationErrorType.Spell, "abbends", ["Abends"]],
    ['durh', ValidationErrorType.Spell, "durh", ["durch", "Dur"]],
  ])
  
  expectValidationErrors(output, 'fr/test/', [
    ['ploungé', ValidationErrorType.Spell, "ploung-", ["plongé"]],
    ['l\'horison', ValidationErrorType.Spell, "l-horison", ["l’horizon", "l’horion"]],
    ['tientes', ValidationErrorType.Spell, "tientes", ["fientes", "teintes", "tentes", "tiennes", "tintes"]],
    ['briese', ValidationErrorType.Spell, "briese", ["briefe", "bries", "brise"]],
    ['sior', ValidationErrorType.Spell, "sior", ["sir", "soir", "Dior", "Sion"]],
    ['tràvers', ValidationErrorType.Spell, "tr-vers", ["travers"]],
  ])
})