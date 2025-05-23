import { slug } from "github-slugger";
import { toText } from "hast-util-to-text";
import type { Root } from "mdast";
import "mdast-util-mdx-jsx";
import nodePath from "node:path";
import { fileURLToPath } from "node:url";
import rehypeParse from "rehype-parse";
import { type Plugin } from "unified";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { getLocale, getLocaleConfig } from "./i18n";
import { ensureTrailingSlash, stripLeadingSlash } from "./path";
import type { StarlightUserConfig } from "./validation";

// All the text content keyed by locale, then keyed by file path.
const contents: Contents = new Map();

export const remarkStarlightSpellChecker: Plugin<
  [{ base: string; srcDir: URL; starlightConfig: StarlightUserConfig }],
  Root
> = function ({ base, srcDir, starlightConfig }) {
  return async (tree, file) => {
    if (file.data.astro?.frontmatter?.["draft"]) return;

    const filePath = normalizeFilePath(base, srcDir, file.history[0]);
    const slug: string | undefined =
      typeof file.data.astro?.frontmatter?.["slug"] === "string"
        ? file.data.astro.frontmatter["slug"]
        : undefined;

    let fileContent: string = "";

    // Extract all string values from frontmatter (recursively, with HTML parsing)
    const frontmatter = file.data.astro?.frontmatter;
    if (frontmatter) {
      const extractStrings = (obj: any): string[] => {
        const strings: string[] = [];
        for (const value of Object.values(obj)) {
          if (typeof value === "string") {
            // Parse HTML and extract text content
            const htmlTree = unified()
              .use(rehypeParse, { fragment: true })
              .parse(value);
            const textContent = toText(htmlTree);
            strings.push(textContent);
          } else if (typeof value === "object" && value !== null) {
            strings.push(...extractStrings(value));
          }
        }
        return strings;
      };

      fileContent += extractStrings(frontmatter).join("\n");
      fileContent += "\n"; // Separate frontmatter from the Markdown content
    }

    // https://github.com/syntax-tree/mdast#nodes
    // https://github.com/syntax-tree/mdast-util-mdx-jsx#nodes
    visit(
      tree,
      ["text", "inlineCode", "paragraph", "heading", "html"],
      (node) => {
        switch (node.type) {
          case "text":
            fileContent += node.value;
            break;
          case "inlineCode":
            fileContent += "`" + node.value + "`";
            break;
          case "paragraph":
            fileContent += "\n";
            break;
          case "heading":
            fileContent += "\n";
            break;
          // case "html": {
          //   const htmlTree = fromHtml(node.value, { fragment: true });

          //   visit(htmlTree, ["text"], (htmlNode: Nodes) => {
          //     fileContent += htmlNode.value;
          //   });

          //   break;
          // }
        }
      }
    );

    const fullFilePath = getFilePath(base, filePath, slug);
    const localeConfig = getLocaleConfig(starlightConfig);
    const locale = getLocale(fullFilePath, localeConfig);

    contents.set(
      locale,
      (contents.get(locale) ?? new Map()).set(fullFilePath, fileContent)
    );
  };
};

export function getValidationData() {
  return { contents };
}

function getFilePath(base: string, filePath: string, slug: string | undefined) {
  if (slug) {
    return nodePath.posix.join(
      stripLeadingSlash(base),
      stripLeadingSlash(ensureTrailingSlash(slug))
    );
  }

  return filePath;
}

function normalizeFilePath(base: string, srcDir: URL, filePath?: string) {
  if (!filePath) {
    throw new Error("Missing file path to validate links.");
  }

  const path = nodePath
    .relative(nodePath.join(fileURLToPath(srcDir), "content/docs"), filePath)
    .replace(/\.\w+$/, "")
    .replace(/(^|[/\\])index$/, "")
    .replace(/[/\\]?$/, "/")
    .split(/[/\\]/)
    .map((segment) => slug(segment))
    .join("/");

  if (base !== "/") {
    return nodePath.posix.join(stripLeadingSlash(base), path);
  }

  return path;
}

// function isMdxIdAttribute(
//   attribute: MdxJsxAttribute | MdxJsxExpressionAttribute
// ): attribute is MdxIdAttribute {
//   return (
//     attribute.type === "mdxJsxAttribute" &&
//     attribute.name === "id" &&
//     typeof attribute.value === "string"
//   );
// }

export type Contents = Map<string, Map<string, string>>;

// interface MdxIdAttribute {
//   name: "id";
//   type: "mdxJsxAttribute";
//   value: string;
// }
