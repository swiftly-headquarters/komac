/**
 * Import path transformer for Komachi blocks
 * Transforms relative imports to package imports when installing blocks via CLI
 */

interface ParsedImport {
  fullMatch: string;
  imports: string;
  path: string;
  startIndex: number;
  endIndex: number;
  isTypeOnlyImport: boolean;
}

/**
 * Parses all import statements from the content
 */
function parseImports(content: string): ParsedImport[] {
  const importRegex =
    /import\s+(type\s+)?{([^}]+)}\s+from\s+["']([^"']+)["'];?/g;

  const imports: ParsedImport[] = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      fullMatch: match[0],
      imports: match[2],
      path: match[3],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      isTypeOnlyImport: match[1] !== undefined,
    });
  }

  return imports;
}

/**
 * Checks if an import path should be transformed to komachi
 */
function shouldTransformToKomachi(path: string): boolean {
  if (!path.startsWith("../")) {
    return false;
  }
  return path.includes("/components/") || path.includes("/utils/");
}

/**
 * Parses import items from an import statement, separating types from values
 */
function parseImportItems(
  imports: string,
  isTypeOnlyImport: boolean,
): { valueImports: string[]; typeImports: string[] } {
  const items = imports
    .split(",")
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);

  const valueImports: string[] = [];
  const typeImports: string[] = [];

  for (const item of items) {
    if (isTypeOnlyImport || item.startsWith("type ")) {
      // For type-only imports or inline type imports
      const typeName = item.startsWith("type ") ? item.slice(5).trim() : item;
      typeImports.push(typeName);
    } else {
      valueImports.push(item);
    }
  }

  return { valueImports, typeImports };
}

/**
 * Builds a consolidated import statement with inline type imports
 * Uses inline `type` keyword to satisfy import/no-duplicates with prefer-inline: true
 */
function buildConsolidatedImport(
  valueImports: string[],
  typeImports: string[],
): string {
  const parts: string[] = [];

  // Add value imports first
  for (const item of valueImports) {
    parts.push(item);
  }

  // Add type imports with inline 'type' keyword
  for (const item of typeImports) {
    parts.push(`type ${item}`);
  }

  return `import { ${parts.join(", ")} } from "komachi";`;
}

/**
 * Transforms relative imports in block source code to package imports
 *
 * This function consolidates all imports from komachi into a single
 * import statement using inline `type` syntax to satisfy ESLint's
 * import/no-duplicates rule with prefer-inline: true.
 *
 * Examples:
 * - Multiple component imports → single consolidated import
 * - `../../components/tabs` + `../../utils/cn` → `import { Tabs, cn } from "komachi";`
 * - Mixed value/type imports → `import { Button, type ButtonProps } from "komachi";`
 *
 * @param content - The source code content to transform
 * @returns Transformed source code with consolidated package imports
 */
export function transformImports(content: string): string {
  const parsedImports = parseImports(content);

  // Separate komachi imports from non-komachi imports
  const komachiImports: ParsedImport[] = [];
  const nonKomachiImports: ParsedImport[] = [];

  for (const imp of parsedImports) {
    if (shouldTransformToKomachi(imp.path)) {
      komachiImports.push(imp);
    } else {
      nonKomachiImports.push(imp);
    }
  }

  // If no komachi imports, return unchanged
  if (komachiImports.length === 0) {
    return content;
  }

  // Collect all value and type imports from komachi imports
  const allValueImports: string[] = [];
  const allTypeImports: string[] = [];

  for (const imp of komachiImports) {
    const { valueImports, typeImports } = parseImportItems(
      imp.imports,
      imp.isTypeOnlyImport,
    );
    allValueImports.push(...valueImports);
    allTypeImports.push(...typeImports);
  }

  // Build the consolidated import statement
  const consolidatedImport = buildConsolidatedImport(
    allValueImports,
    allTypeImports,
  );

  // Replace the first komachi import with the consolidated import
  // and remove all other komachi imports
  let result = content;

  // Process in reverse order to preserve indices
  const sortedKomachiImports = [...komachiImports].sort(
    (a, b) => b.startIndex - a.startIndex,
  );

  for (let i = 0; i < sortedKomachiImports.length; i++) {
    const imp = sortedKomachiImports[i];
    if (i === sortedKomachiImports.length - 1) {
      // This is the first import (processing in reverse), replace with consolidated
      result =
        result.slice(0, imp.startIndex) +
        consolidatedImport +
        result.slice(imp.endIndex);
    } else {
      // Remove this import and any preceding newline (to avoid leaving blank lines)
      let startIndex = imp.startIndex;
      let endIndex = imp.endIndex;

      // Check if there's a newline before this import to remove
      if (startIndex > 0 && result[startIndex - 1] === "\n") {
        startIndex--;
      }

      result = result.slice(0, startIndex) + result.slice(endIndex);
    }
  }

  return result;
}
