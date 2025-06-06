import { build } from "astro";
import { fileURLToPath } from "node:url";
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

export function expectValidationUnsupportedLanguage(
  output: string,
  locales: string[]
) {
  const per = getPermutations(locales);
  const localePattern = `(${per.map((pair) => pair.join(", ")).join("|")})`;

  expect(output).toMatch(
    new RegExp(
      `Unsupported ${
        locales.length === 1 ? "language" : "languages"
      }: ${localePattern} \\\(No ${
        locales.length === 1 ? "dictionary" : "dictionaries"
      } available.\\\)`
    )
  );
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
    rule: string,
    suggestions?: string[],
  ][]
) {
  expect(output).toMatch(
    new RegExp(
      `▶ ${path}
${validationWarnings
  .map(
    ([word, type, rule, suggestions], index) =>
      `.* ${
        index < validationWarnings.length - 1 ? "├" : "└"
      }─ ${word} - ${type} - ${rule}${
        suggestions
          ? suggestions.length > 0
            ? ` \\\(${suggestions.join(", ")}\\\)`
            : " no suggestions"
          : ""
      }`
  )
  .join("\n")}`
    )
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
    rule: string,
    suggestions?: string[],
  ][]
) {
  expect(output).toMatch(
    new RegExp(
      `▶ ${path}
${validationErrors
  .map(
    ([word, type, rule, suggestions], index) =>
      `.* ${
        index < validationErrors.length - 1 ? "├" : "└"
      }─ ${word} - ${type} - ${rule}${
        suggestions
          ? suggestions.length > 0
            ? ` \\\(${suggestions.join(", ")}\\\)`
            : " no suggestions"
          : ""
      }`
  )
  .join("\n")}`
    )
  );
}

function getPermutations(arr: any[]): any[][] {
  if (arr.length === 0) return [[]];
  const permutations = [];
  for (let i = 0; i < arr.length; i++) {
    const currentElement = arr[i];
    const remainingElements = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingPermutations = getPermutations(remainingElements);
    for (const permutation of remainingPermutations) {
      permutations.push([currentElement, ...permutation]);
    }
  }
  return permutations;
}
