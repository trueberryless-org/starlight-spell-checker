import { fileURLToPath } from "node:url";

import { build } from "astro";
import { expect, vi } from "vitest";

import type { ValidationErrorType } from "../libs/validation";

export async function buildFixture(name: string) {
  const fixturePath = fileURLToPath(
    new URL(`fixtures/${name}/`, import.meta.url)
  );

  let output = "";
  let status: "success" | "error";

  function writeOutput(chunk: string | Uint8Array) {
    output += String(chunk);
    return true;
  }

  const stdoutWriteSpy = vi
    .spyOn(process.stdout, "write")
    .mockImplementation(writeOutput);
  const stderrWriteSpy = vi
    .spyOn(process.stderr, "write")
    .mockImplementation(writeOutput);

  try {
    await build({ root: fixturePath });
    status = "success";
  } catch {
    status = "error";
  }

  stderrWriteSpy.mockRestore();
  stdoutWriteSpy.mockRestore();

  return { output, status };
}

export function expectValidationSuccess(output: string) {
  expect(output).toMatch(new RegExp(`All words spelled correctly.`));
}

export function expectValidationWarningCount(
  output: string,
  count: number,
  filesCount: number
) {
  expect(output).toMatch(
    new RegExp(
      `Found ${count} ${
        count === 1 ? "warning" : "warnings"
      } in ${filesCount} ${filesCount === 1 ? "file" : "files"}.`
    )
  );
}

export function expectValidationWarnings(
  output: string,
  path: string,
  validationWarnings: [
    word: string,
    type: ValidationErrorType,
    suggestions?: string[]
  ][]
) {
  expect(output).toMatch(
    new RegExp(`▶ ${path}
      ${validationWarnings
        .map(
          ([word, type, suggestions], index) =>
            `.* ${
              index < validationWarnings.length - 1 ? "├" : "└"
            }─ ${word} - ${type}${
              suggestions
                ? suggestions.length > 0
                  ? ` \(${suggestions.join(", ")}\)`
                  : " no suggestions"
                : ""
            }`
        )
        .join("\n")}`)
  );
}

export function expectValidationErrorCount(
  output: string,
  count: number,
  filesCount: number
) {
  expect(output).toMatch(
    new RegExp(
      `Found ${count} ${count === 1 ? "error" : "errors"} in ${filesCount} ${
        filesCount === 1 ? "file" : "files"
      }.`
    )
  );
}

export function expectValidationErrors(
  output: string,
  path: string,
  validationErrors: [
    word: string,
    type: ValidationErrorType,
    suggestions?: string[]
  ][]
) {
  expect(output).toMatch(
    new RegExp(`▶ ${path}
      ${validationErrors
        .map(
          ([word, type, suggestions], index) =>
            `.* ${
              index < validationErrors.length - 1 ? "├" : "└"
            }─ ${word} - ${type}${
              suggestions
                ? suggestions.length > 0
                  ? ` \(${suggestions.join(", ")}\)`
                  : " no suggestions"
                : ""
            }`
        )
        .join("\n")}`)
  );
}
