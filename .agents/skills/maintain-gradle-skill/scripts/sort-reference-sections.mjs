#!/usr/bin/env node

import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const sourceIndexPrefix = "source-index-";

const sectionSpecs = [
  {
    heading: "Documentation",
    pattern: /^- \[([^\]]+)\]\((https?:\/\/[^)]+)\)$/,
    key: ([, title]) => normalizeKey(title),
    expected: "- [Official title](public URL)",
  },
  {
    heading: "Source Code",
    pattern: /^- `([^`]+)`$/,
    key: ([, sourcePath]) => sourcePath,
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
  const sourceIndexFiles = await listMarkdownFiles(referencesDir);
  const runtimeReferences = await listRuntimeReferences(runtimeReferencesDir);
  const sourceIndexes = sourceIndexFiles
    .filter(({ name }) => name.startsWith(sourceIndexPrefix))
    .map((file) => toSourceIndex(file, runtimeReferencesDir));

  return {
    referencesDir,
    runtimeReferences,
    sourceIndexFiles,
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
    ...findInvalidSourceIndexNames(workspace),
    ...findMissingRuntimeTargets(workspace),
    ...findMissingSourceIndexes(workspace),
    ...(await findSourceIndexH1Mismatches(workspace)),
  ];

  if (errors.length > 0) {
    throw new Error(
      ["Source-index topology is invalid:", ...errors].join("\n"),
    );
  }
}

function findInvalidSourceIndexNames({ sourceIndexFiles }) {
  const invalidFiles = sourceIndexFiles.filter(
    ({ name }) => !name.startsWith(sourceIndexPrefix),
  );

  if (invalidFiles.length === 0) {
    return [];
  }

  return [
    `- Source-index files must use the ${sourceIndexPrefix} prefix: ${formatFileList(
      invalidFiles,
    )}`,
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
  sourceIndexFiles,
}) {
  const sourceIndexNames = new Set(sourceIndexFiles.map(({ name }) => name));
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

async function findSourceIndexH1Mismatches({
  runtimeReferences,
  sourceIndexes,
}) {
  const mismatches = [];

  for (const sourceIndex of sourceIndexes) {
    const runtimeReference = runtimeReferences.get(sourceIndex.targetName);

    if (runtimeReference === undefined) {
      continue;
    }

    const sourceIndexH1 = await readFirstH1(sourceIndex.file);
    const targetH1 = await readFirstH1(runtimeReference.file);

    if (sourceIndexH1 !== targetH1) {
      mismatches.push(
        `${relativePath(sourceIndex.file)} (${sourceIndexH1 || "<missing H1>"}) -> ${relativePath(runtimeReference.file)} (${targetH1 || "<missing H1>"})`,
      );
    }
  }

  if (mismatches.length === 0) {
    return [];
  }

  return [
    `- Source-index H1s must match owning runtime reference H1s: ${mismatches.join(
      ", ",
    )}`,
  ];
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
    return lines;
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
  return lines.map((line) => {
    const match = line.match(section.pattern);

    if (match === null) {
      throw new Error(
        `${file}: ${headingLine} contains malformed entry: ${line}. Expected ${section.expected}.`,
      );
    }

    return {
      line,
      sortKey: section.key(match),
    };
  });
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

Validates Gradle source-index topology and sorts single-line Markdown entries under "## Documentation" and "## Source Code".

Options:
  --check              Report files that would change without writing them.
`);
}
