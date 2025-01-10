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
    ['Github', ValidationErrorType.CasePolice, ["GitHub"]],
    ['kfc', ValidationErrorType.CasePolice, ["KFC"]],
    ['nvidia', ValidationErrorType.CasePolice, ["NVIDIA"]],
    ['Gcp', ValidationErrorType.CasePolice, ["GCP"]],
    ['posix', ValidationErrorType.CasePolice, ["POSIX"]],
    ['Iaas', ValidationErrorType.CasePolice, ["IaaS"]],
    ['wifi', ValidationErrorType.CasePolice, ["Wi-Fi"]],
    ['eSim', ValidationErrorType.CasePolice, ["eSIM"]],
    ['Airpods', ValidationErrorType.CasePolice, ["AirPods"]],
    ['1password', ValidationErrorType.CasePolice, ["1Password"]],
    ['Angularjs', ValidationErrorType.CasePolice, ["AngularJS"]],
    ['Commonjs', ValidationErrorType.CasePolice, ["CommonJS"]],
    ['sqlserver', ValidationErrorType.CasePolice, ["SQLServer"]],
  ])
  
  expectValidationErrors(output, 'de/', [
    ['Github', ValidationErrorType.CasePolice, ["GitHub"]],
    ['kfc', ValidationErrorType.CasePolice, ["KFC"]],
    ['nvidia', ValidationErrorType.CasePolice, ["NVIDIA"]],
    ['Gcp', ValidationErrorType.CasePolice, ["GCP"]],
    ['posix', ValidationErrorType.CasePolice, ["POSIX"]],
    ['Iaas', ValidationErrorType.CasePolice, ["IaaS"]],
    ['wifi', ValidationErrorType.CasePolice, ["Wi-Fi"]],
    ['eSim', ValidationErrorType.CasePolice, ["eSIM"]],
    ['Airpods', ValidationErrorType.CasePolice, ["AirPods"]],
    ['1password', ValidationErrorType.CasePolice, ["1Password"]],
    ['Angularjs', ValidationErrorType.CasePolice, ["AngularJS"]],
    ['Commonjs', ValidationErrorType.CasePolice, ["CommonJS"]],
    ['sqlserver', ValidationErrorType.CasePolice, ["SQLServer"]],
  ])
  
  expectValidationErrors(output, 'fr/', [
    ['Github', ValidationErrorType.CasePolice, ["GitHub"]],
    ['kfc', ValidationErrorType.CasePolice, ["KFC"]],
    ['nvidia', ValidationErrorType.CasePolice, ["NVIDIA"]],
    ['Gcp', ValidationErrorType.CasePolice, ["GCP"]],
    ['posix', ValidationErrorType.CasePolice, ["POSIX"]],
    ['Iaas', ValidationErrorType.CasePolice, ["IaaS"]],
    ['wifi', ValidationErrorType.CasePolice, ["Wi-Fi"]],
    ['eSim', ValidationErrorType.CasePolice, ["eSIM"]],
    ['Airpods', ValidationErrorType.CasePolice, ["AirPods"]],
    ['1password', ValidationErrorType.CasePolice, ["1Password"]],
    ['Angularjs', ValidationErrorType.CasePolice, ["AngularJS"]],
    ['Commonjs', ValidationErrorType.CasePolice, ["CommonJS"]],
    ['sqlserver', ValidationErrorType.CasePolice, ["SQLServer"]],
  ])
})
