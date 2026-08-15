#!/usr/bin/env node

import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const sourceIndexPrefix = "source-index-";
const guidancePrefix = "guidance-";
const protocolPrefix = "protocol-";
const allowedReferencePrefixes = [
  guidancePrefix,
  protocolPrefix,
  sourceIndexPrefix,
];

const sectionSpecs = [
  {
    heading: "Documentation",
    pattern: /^- \[([^\]]+)\]\((https?:\/\/[^)]+)\)$/,
    key: ([, title]) => normalizeKey(title),
    identity: ([, , url]) => new URL(url).href,
    validate: ([, , url]) => validateDocumentationUrl(url),
    expected: "- [Official title](public URL)",
  },
  {
    heading: "Source Code",
    pattern: /^- `([^`]+)`$/,
    key: ([, sourcePath]) => sourcePath,
    identity: ([, sourcePath]) => sourcePath,
    validate: ([, sourcePath]) => validateSourcePath(sourcePath),
    expected: "- `repository-relative/path`",
  },
];

try {
  const options = parseArgs(process.argv.slice(2));
  const workspace = await loadSourceIndexWorkspace();

  await validateSourceIndexWorkspace(workspace);

  const result = await sortSourceIndexFiles(workspace.sourceIndexes, {
    check: options.check,
  });

  reportResult(result, options);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
}

async function loadSourceIndexWorkspace() {
  const repoRoot = await findRepoRoot(scriptDir);
  const referencesDir = path.resolve(scriptDir, "../references");
  const runtimeReferencesDir = path.join(repoRoot, "skills/gradle/references");
  const referenceFiles = await listMarkdownFiles(referencesDir);
  const runtimeReferences = await listRuntimeReferences(runtimeReferencesDir);
  const guidanceFiles = referenceFiles.filter(({ name }) =>
    name.startsWith(guidancePrefix),
  );
  const sourceIndexes = referenceFiles
    .filter(({ name }) => name.startsWith(sourceIndexPrefix))
    .map((file) => toSourceIndex(file, runtimeReferencesDir));

  return {
    guidanceFiles,
    referenceFiles,
    referencesDir,
    runtimeReferences,
    sourceIndexes,
  };
}

async function listRuntimeReferences(runtimeReferencesDir) {
  const files = await listMarkdownFiles(runtimeReferencesDir);
  return new Map(
    files.map((file) => [
      file.name,
      {
        ...file,
        sourceIndexName: `${sourceIndexPrefix}${file.name}`,
      },
    ]),
  );
}

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => ({
      name: entry.name,
      file: path.join(directory, entry.name),
    }))
    .sort((left, right) => compareStrings(left.name, right.name));
}

function toSourceIndex(file, runtimeReferencesDir) {
  const targetName = file.name.slice(sourceIndexPrefix.length);
  return {
    ...file,
    targetName,
    targetFile: path.join(runtimeReferencesDir, targetName),
  };
}

async function validateSourceIndexWorkspace(workspace) {
  const errors = [
    ...findInvalidReferenceNames(workspace),
    ...findMissingRuntimeTargets(workspace),
    ...findMissingSourceIndexes(workspace),
    ...(await findGuidanceShapeFailures(workspace)),
    ...(await findSourceIndexShapeFailures(workspace)),
  ];

  if (errors.length > 0) {
    throw new Error(
      ["Gradle maintenance-reference topology is invalid:", ...errors].join(
        "\n",
      ),
    );
  }
}

function findInvalidReferenceNames({ referenceFiles }) {
  const invalidFiles = referenceFiles.filter(
    ({ name }) =>
      !allowedReferencePrefixes.some((prefix) => name.startsWith(prefix)),
  );

  if (invalidFiles.length === 0) {
    return [];
  }

  return [
    `- Maintenance references must use the ${guidancePrefix}, ${protocolPrefix}, or ${sourceIndexPrefix} prefix: ${formatFileList(invalidFiles)}`,
  ];
}

function findMissingRuntimeTargets({ runtimeReferences, sourceIndexes }) {
  const missingTargets = sourceIndexes.filter(
    ({ targetName }) => !runtimeReferences.has(targetName),
  );

  if (missingTargets.length === 0) {
    return [];
  }

  return [
    `- Source-index files must map to existing runtime references: ${missingTargets
      .map(
        ({ file, targetFile }) =>
          `${relativePath(file)} -> ${relativePath(targetFile)}`,
      )
      .join(", ")}`,
  ];
}

function findMissingSourceIndexes({
  referencesDir,
  runtimeReferences,
  sourceIndexes,
}) {
  const sourceIndexNames = new Set(sourceIndexes.map(({ name }) => name));
  const missingSourceIndexes = [...runtimeReferences.values()].filter(
    ({ sourceIndexName }) => !sourceIndexNames.has(sourceIndexName),
  );

  if (missingSourceIndexes.length === 0) {
    return [];
  }

  return [
    `- Runtime references must have matching source-index files: ${missingSourceIndexes
      .map(
        ({ file, sourceIndexName }) =>
          `${relativePath(file)} -> ${relativePath(path.join(referencesDir, sourceIndexName))}`,
      )
      .join(", ")}`,
  ];
}

async function findGuidanceShapeFailures({ guidanceFiles }) {
  const failures = [];

  for (const { file } of guidanceFiles) {
    const content = await readFile(file, "utf8");
    const h1Count = content
      .split(/\r?\n/)
      .filter((line) => line.startsWith("# ")).length;

    if (h1Count !== 1) {
      failures.push(`${relativePath(file)} must contain exactly one H1`);
    }

    if (!/^Read this when: /m.test(content)) {
      failures.push(
        `${relativePath(file)} must contain a Read this when: scope`,
      );
    }
  }

  if (failures.length === 0) {
    return [];
  }

  return [`- Guidance reference shape is invalid: ${failures.join(", ")}`];
}

async function findSourceIndexShapeFailures({
  runtimeReferences,
  sourceIndexes,
}) {
  const failures = [];

  for (const sourceIndex of sourceIndexes) {
    const runtimeReference = runtimeReferences.get(sourceIndex.targetName);

    if (runtimeReference === undefined) {
      continue;
    }

    const content = await readFile(sourceIndex.file, "utf8");
    const lines = content.split(/\r?\n/);
    const sourceIndexH1s = lines.filter((line) => line.startsWith("# "));
    const targetH1 = await readFirstH1(runtimeReference.file);
    const h2s = lines.filter((line) => line.startsWith("## "));
    const documentationIndex = h2s.indexOf("## Documentation");
    const sourceCodeIndex = h2s.indexOf("## Source Code");
    const unsupportedH2s = h2s.filter(
      (heading) =>
        heading !== "## Documentation" && heading !== "## Source Code",
    );

    if (sourceIndexH1s.length !== 1) {
      failures.push(
        `${relativePath(sourceIndex.file)} must contain exactly one H1`,
      );
    } else if (sourceIndexH1s[0] !== targetH1) {
      failures.push(
        `${relativePath(sourceIndex.file)} (${sourceIndexH1s[0]}) must match ${relativePath(runtimeReference.file)} (${targetH1 || "<missing H1>"})`,
      );
    }

    if (
      countOccurrences(h2s, "## Documentation") > 1 ||
      countOccurrences(h2s, "## Source Code") > 1
    ) {
      failures.push(
        `${relativePath(sourceIndex.file)} must contain at most one Documentation and one Source Code section`,
      );
    }

    if (documentationIndex === -1 && sourceCodeIndex === -1) {
      failures.push(
        `${relativePath(sourceIndex.file)} must contain a Documentation or Source Code section`,
      );
    }

    if (
      documentationIndex !== -1 &&
      sourceCodeIndex !== -1 &&
      documentationIndex > sourceCodeIndex
    ) {
      failures.push(
        `${relativePath(sourceIndex.file)} must place Documentation before Source Code`,
      );
    }

    if (unsupportedH2s.length > 0) {
      failures.push(
        `${relativePath(sourceIndex.file)} contains unsupported H2 sections: ${unsupportedH2s.join(", ")}`,
      );
    }
  }

  if (failures.length === 0) {
    return [];
  }

  return [`- Source-index shape is invalid: ${failures.join(", ")}`];
}

async function readFirstH1(file) {
  const content = await readFile(file, "utf8");
  return content.split(/\r?\n/).find((line) => line.startsWith("# ")) ?? "";
}

async function sortSourceIndexFiles(sourceIndexes, { check }) {
  const changedFiles = [];

  for (const { file } of sourceIndexes) {
    const original = await readFile(file, "utf8");
    const sorted = sortMarkdown(original, file);

    if (sorted === original) {
      continue;
    }

    changedFiles.push(file);

    if (!check) {
      await writeFile(file, sorted, "utf8");
    }
  }

  return { changedFiles };
}

function sortMarkdown(content, file) {
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  const hadTrailingNewline = content.endsWith("\n");
  const lines = content.split(/\r?\n/);

  if (hadTrailingNewline) {
    lines.pop();
  }

  let sortedLines = lines;

  for (const section of sectionSpecs) {
    sortedLines = sortSection(sortedLines, section, file);
  }

  return sortedLines.join(eol) + (hadTrailingNewline ? eol : "");
}

function sortSection(lines, section, file) {
  const headingLine = `## ${section.heading}`;
  const headingIndex = lines.findIndex((line) => line === headingLine);

  if (headingIndex === -1) {
    return lines;
  }

  const bodyStart = headingIndex + 1;
  const bodyEnd = findNextH2(lines, bodyStart);
  const body = lines.slice(bodyStart, bodyEnd);
  const invalidLine = body.find(
    (line) => line.trim() !== "" && !line.startsWith("- "),
  );

  if (invalidLine !== undefined) {
    throw new Error(
      `${file}: ${headingLine} contains a non-entry line: ${invalidLine}`,
    );
  }

  const firstEntryIndex = body.findIndex((line) => line.startsWith("- "));

  if (firstEntryIndex === -1) {
    throw new Error(`${file}: ${headingLine} must contain at least one entry.`);
  }

  const lastEntryIndex = body.findLastIndex((line) => line.startsWith("- "));
  const entryArea = body.slice(firstEntryIndex, lastEntryIndex + 1);

  if (entryArea.some((line) => line.trim() === "")) {
    throw new Error(
      `${file}: ${headingLine} contains blank lines between entries.`,
    );
  }

  const entries = parseSectionEntries(entryArea, section, file, headingLine);
  const sortedEntries = [...entries]
    .sort(compareParsedEntries)
    .map(({ line }) => line);
  const sortedBody = [
    ...body.slice(0, firstEntryIndex),
    ...sortedEntries,
    ...body.slice(lastEntryIndex + 1),
  ];

  return [...lines.slice(0, bodyStart), ...sortedBody, ...lines.slice(bodyEnd)];
}

function parseSectionEntries(lines, section, file, headingLine) {
  const entries = lines.map((line) => {
    const match = line.match(section.pattern);

    if (match === null) {
      throw new Error(
        `${file}: ${headingLine} contains malformed entry: ${line}. Expected ${section.expected}.`,
      );
    }

    const validationFailure = section.validate(match);

    if (validationFailure !== undefined) {
      throw new Error(
        `${file}: ${headingLine} contains invalid entry: ${line}. ${validationFailure}.`,
      );
    }

    return {
      identity: section.identity(match),
      line,
      sortKey: section.key(match),
    };
  });

  const seen = new Set();

  for (const entry of entries) {
    if (seen.has(entry.identity)) {
      throw new Error(
        `${file}: ${headingLine} contains duplicate entry: ${entry.identity}`,
      );
    }

    seen.add(entry.identity);
  }

  return entries;
}

function findNextH2(lines, startIndex) {
  const nextIndex = lines.findIndex(
    (line, index) => index >= startIndex && line.startsWith("## "),
  );
  return nextIndex === -1 ? lines.length : nextIndex;
}

async function findRepoRoot(startDir) {
  let currentDir = startDir;

  while (true) {
    if (
      (await pathExists(path.join(currentDir, "skills/gradle/SKILL.md"))) &&
      (await pathExists(path.join(currentDir, "skills/gradle/references")))
    ) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      throw new Error(
        "Could not locate repository root containing skills/gradle.",
      );
    }

    currentDir = parentDir;
  }
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function reportResult({ changedFiles }, { check }) {
  for (const file of changedFiles) {
    console.log(`${check ? "Would sort" : "Sorted"} ${relativePath(file)}`);
  }

  if (changedFiles.length === 0) {
    console.log("All Gradle source-index sections are sorted.");
  }

  if (check && changedFiles.length > 0) {
    process.exitCode = 1;
  }
}

function formatFileList(files) {
  return files.map(({ file }) => relativePath(file)).join(", ");
}

function relativePath(file) {
  return path.relative(process.cwd(), file) || path.basename(file);
}

function compareParsedEntries(left, right) {
  return (
    compareStrings(left.sortKey, right.sortKey) ||
    compareStrings(left.line, right.line)
  );
}

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeKey(value) {
  return value.toLowerCase();
}

function countOccurrences(values, expected) {
  return values.filter((value) => value === expected).length;
}

function validateSourcePath(sourcePath) {
  if (
    sourcePath.includes("\\") ||
    path.posix.isAbsolute(sourcePath) ||
    path.win32.parse(sourcePath).root !== "" ||
    sourcePath === "." ||
    sourcePath === ".." ||
    sourcePath.startsWith("../") ||
    sourcePath !== path.posix.normalize(sourcePath)
  ) {
    return "Source paths must be normalized repository-relative paths";
  }

  return undefined;
}

function validateDocumentationUrl(url) {
  try {
    new URL(url);
    return url.includes("#") ? "URL fragments are not allowed" : undefined;
  } catch {
    return "Documentation links must be valid HTTP(S) URLs";
  }
}

function parseArgs(args) {
  const parsed = {
    check: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--check") {
      parsed.check = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function printUsage() {
  console.log(`Usage: node ${relativePath(scriptFile)} [--check]

Validates Gradle maintenance-reference topology and source-index entry invariants, then sorts single-line Markdown entries under "## Documentation" and "## Source Code".

Options:
  --check              Report files that would change without writing them.
  -h, --help           Show this help text.

Output:
  Reports each sorted or out-of-order source-index file, or confirms that all sections are sorted.

Exit codes:
  0  Validation passed; sorting completed or no files would change.
  1  --check found source-index files that require sorting.
  2  Arguments, topology, or source-index entries are invalid.

Example:
  node ${relativePath(scriptFile)} --check
`);
}
