import { expect, test } from 'vitest'

import { ValidationErrorType } from '../libs/validation'

import { buildFixture, expectValidationErrorCount, expectValidationErrors, expectValidationSuccess } from './utils'

test('builds with case police throw error valid Multilingual content', async () => {
  const { output, status } = await buildFixture('case-police-throw-error-valid-content-multilingual')

  expect(status).toBe('success')
  expectValidationSuccess(output)
})

test('does not build with case police throw error invalid Multilingual content', async () => {
  const { output, status } = await buildFixture('case-police-throw-error-invalid-content-multilingual')

  expect(status).toBe('error')

  expectValidationErrorCount(output, 39, 3)

  expectValidationErrors(output, '/', [
    ['Github', ValidationErrorType.CasePolice, "retext-case-police", ["GitHub"]],
    ['kfc', ValidationErrorType.CasePolice, "retext-case-police", ["KFC"]],
    ['nvidia', ValidationErrorType.CasePolice, "retext-case-police", ["NVIDIA"]],
    ['Gcp', ValidationErrorType.CasePolice, "retext-case-police", ["GCP"]],
    ['posix', ValidationErrorType.CasePolice, "retext-case-police", ["POSIX"]],
    ['Iaas', ValidationErrorType.CasePolice, "retext-case-police", ["IaaS"]],
    ['wifi', ValidationErrorType.CasePolice, "retext-case-police", ["Wi-Fi"]],
    ['eSim', ValidationErrorType.CasePolice, "retext-case-police", ["eSIM"]],
    ['Airpods', ValidationErrorType.CasePolice, "retext-case-police", ["AirPods"]],
    ['1password', ValidationErrorType.CasePolice, "retext-case-police", ["1Password"]],
    ['Angularjs', ValidationErrorType.CasePolice, "retext-case-police", ["AngularJS"]],
    ['Commonjs', ValidationErrorType.CasePolice, "retext-case-police", ["CommonJS"]],
    ['sqlserver', ValidationErrorType.CasePolice, "retext-case-police", ["SQLServer"]],
  ])
  
  expectValidationErrors(output, 'de/', [
    ['Github', ValidationErrorType.CasePolice, "retext-case-police", ["GitHub"]],
    ['kfc', ValidationErrorType.CasePolice, "retext-case-police", ["KFC"]],
    ['nvidia', ValidationErrorType.CasePolice, "retext-case-police", ["NVIDIA"]],
    ['Gcp', ValidationErrorType.CasePolice, "retext-case-police", ["GCP"]],
    ['posix', ValidationErrorType.CasePolice, "retext-case-police", ["POSIX"]],
    ['Iaas', ValidationErrorType.CasePolice, "retext-case-police", ["IaaS"]],
    ['wifi', ValidationErrorType.CasePolice, "retext-case-police", ["Wi-Fi"]],
    ['eSim', ValidationErrorType.CasePolice, "retext-case-police", ["eSIM"]],
    ['Airpods', ValidationErrorType.CasePolice, "retext-case-police", ["AirPods"]],
    ['1password', ValidationErrorType.CasePolice, "retext-case-police", ["1Password"]],
    ['Angularjs', ValidationErrorType.CasePolice, "retext-case-police", ["AngularJS"]],
    ['Commonjs', ValidationErrorType.CasePolice, "retext-case-police", ["CommonJS"]],
    ['sqlserver', ValidationErrorType.CasePolice, "retext-case-police", ["SQLServer"]],
  ])
  
  expectValidationErrors(output, 'fr/', [
    ['Github', ValidationErrorType.CasePolice, "retext-case-police", ["GitHub"]],
    ['kfc', ValidationErrorType.CasePolice, "retext-case-police", ["KFC"]],
    ['nvidia', ValidationErrorType.CasePolice, "retext-case-police", ["NVIDIA"]],
    ['Gcp', ValidationErrorType.CasePolice, "retext-case-police", ["GCP"]],
    ['posix', ValidationErrorType.CasePolice, "retext-case-police", ["POSIX"]],
    ['Iaas', ValidationErrorType.CasePolice, "retext-case-police", ["IaaS"]],
    ['wifi', ValidationErrorType.CasePolice, "retext-case-police", ["Wi-Fi"]],
    ['eSim', ValidationErrorType.CasePolice, "retext-case-police", ["eSIM"]],
    ['Airpods', ValidationErrorType.CasePolice, "retext-case-police", ["AirPods"]],
    ['1password', ValidationErrorType.CasePolice, "retext-case-police", ["1Password"]],
    ['Angularjs', ValidationErrorType.CasePolice, "retext-case-police", ["AngularJS"]],
    ['Commonjs', ValidationErrorType.CasePolice, "retext-case-police", ["CommonJS"]],
    ['sqlserver', ValidationErrorType.CasePolice, "retext-case-police", ["SQLServer"]],
  ])
})
