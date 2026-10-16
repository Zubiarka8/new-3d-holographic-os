import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
const cases = [
  {
    name: "unrelated edit",
    input: JSON.stringify({
      hook_event_name: "PostToolUse",
      tool_input: { file_path: "docs/example.md" },
    }),
    status: 0,
    text: "skipped",
  },
  {
    name: "malformed event",
    input: "{broken",
    status: 2,
    text: "could not validate",
  },
  {
    name: "TypeScript patch",
    input: JSON.stringify({
      hook_event_name: "PostToolUse",
      tool_name: "apply_patch",
      tool_input: {
        command: "*** Begin Patch\n*** Update File: src/main.ts\n*** End Patch",
      },
    }),
    status: 0,
    text: "quality:file",
  },
];
for (const item of cases) {
  const result = spawnSync("node", ["scripts/hook-quality.mjs"], {
    input: item.input,
    encoding: "utf8",
    timeout: 30000,
  });
  assert.equal(
    result.status,
    item.status,
    `${item.name}: ${result.stdout} ${result.stderr}`,
  );
  assert.ok((result.stdout + result.stderr).includes(item.text), item.name);
  console.log(`${item.name}: verified`);
}
