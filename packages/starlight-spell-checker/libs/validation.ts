import { fileURLToPath } from "node:url";
import { statSync } from "node:fs";
import { posix } from "node:path";

import type { StarlightUserConfig as StarlightUserConfigWithPlugins } from "@astrojs/starlight/types";
import type { AstroConfig, AstroIntegrationLogger } from "astro";
import { bgGreen, black, blue, dim, green, red } from "kleur/colors";

import type { StarlightSpellCheckerConfig } from "../libs/config";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { retext } from "retext";
import retextSpell from "retext-spell";
import dictionaryEn from "dictionary-en";
import retextReadability from "retext-readability";
import retextIndefiniteArticle from "retext-indefinite-article";
import { visit } from "unist-util-visit";
import { promises as fs } from "fs";
import path from "path";
import type { Root } from "mdast";
import { getLocaleConfig, getLocaleDictionary } from "./i18n";
import { ensureTrailingSlash, stripLeadingSlash } from "./path";

export async function validateTexts(
  pages: PageData[],
  outputDir: URL,
  astroConfig: AstroConfig,
  starlightConfig: StarlightUserConfig,
  options: StarlightSpellCheckerConfig
) {
  process.stdout.write(`\n${bgGreen(black(` validating spelling `))}\n`);

  const processor = unified()
    .use(remarkParse) // Parse Markdown to MDAST
    .use(remarkRehype) // Convert MDAST to HAST for easier text processing
    .use(rehypeStringify); // Optionally stringify back to HTML (for debugging)

  const localeConfig = getLocaleConfig(starlightConfig);

  const allPages: Pages = new Set(
    pages.map((page) =>
      ensureTrailingSlash(
        astroConfig.base === "/"
          ? stripLeadingSlash(page.pathname)
          : posix.join(stripLeadingSlash(astroConfig.base), page.pathname)
      )
    )
  );

  const errors = new Map();

  // Iterate through all pages
  for (const page of allPages) {
    console.log(page);
    if (!isValidAsset(page, astroConfig, outputDir)) {
      continue;
    }
    let dictionary;

    if (localeConfig) {
      dictionary = getLocaleDictionary(page, localeConfig);
    }
    if (!dictionary) {
      dictionary = dictionaryEn;
    }

    console.log(dictionary);

    let retextProcessor = retext()
      .use(retextSpell, {
        dictionary,
      })
      .use(retextReadability, { age: 22 }) // Customize readability target age
      .use(retextIndefiniteArticle);

    const filePath = path.join(outputDir.pathname, page);
    const content = await fs.readFile(filePath, "utf-8");

    try {
      // Parse the Markdown content
      const parsed = processor.parse(content);

      // Extract plain text from Markdown
      const plainText = extractText(parsed);

      // Analyze text with retext
      const file = await retextProcessor.process(plainText);

      // Collect messages (errors/warnings)
      if (file.messages.length > 0) {
        errors.set(filePath, file.messages);
      }
    } catch (err) {
      console.error(`Error processing file ${filePath}:`, err);
    }
  }

  return errors;
}

/**
 * Extract plain text from MDAST nodes.
 */
function extractText(ast: Root) {
  let text = "";
  visit(ast, "text", (node) => {
    text += node.value + " ";
  });
  return text.trim();
}

export function logErrors(
  pluginLogger: AstroIntegrationLogger,
  errors: Map<string, any>
) {
  const logger = pluginLogger.fork("");

  if (errors.size === 0) {
    logger.info(green("✓ All words spelled correctly.\n"));
    return;
  }

  const errorCount = [...errors.values()].reduce(
    (acc, links) => acc + links.length,
    0
  );

  logger.error(
    red(
      `✗ Found ${errorCount} misspelled ${pluralize(errorCount, "word")} in ${
        errors.size
      } ${pluralize(errors.size, "file")}.`
    )
  );

  for (const [file, validationErrors] of errors) {
    logger.info(`${red("▶")} ${blue(file)}`);

    for (const [index, validationError] of validationErrors.entries()) {
      logger.info(
        `  ${blue(`${index < validationErrors.length - 1 ? "├" : "└"}─`)} ${
          validationError.link
        }${dim(` - ${validationError.type}`)}`
      );
    }
  }

  process.stdout.write("\n");
}

/**
 * Check if a link is a valid asset in the build output directory.
 */
function isValidAsset(path: string, astroConfig: AstroConfig, outputDir: URL) {
  if (astroConfig.base !== "/") {
    const base = stripLeadingSlash(astroConfig.base);

    if (path.startsWith(base)) {
      path = path.replace(new RegExp(`^${stripLeadingSlash(base)}/?`), "");
    } else {
      return false;
    }
  }

  try {
    const filePath = fileURLToPath(new URL(path, outputDir));
    const stats = statSync(filePath);
    console.log(stats.isFile());

    return stats.isFile();
  } catch {
    return false;
  }
}

function pluralize(count: number, singular: string) {
  return count === 1 ? singular : `${singular}s`;
}

/**
 * Check if a page is excluded from validation by the user.
 */
// function isExcludedPage(page: string, exclude: string[]) {
//   return picomatch(exclude)(page);
// }

interface PageData {
  pathname: string;
}

type Pages = Set<PageData["pathname"]>;

export type StarlightUserConfig = Omit<
  StarlightUserConfigWithPlugins,
  "plugins"
>;
