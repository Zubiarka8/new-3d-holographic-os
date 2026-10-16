import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Never execute paths or command text supplied in the tool event.
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
try {
  const input = readFileSync(0, "utf8");
  if (input.length > 2_000_000) throw new Error("Hook event exceeds 2 MB");
  const event = JSON.parse(input);
  if (event.hook_event_name !== "PostToolUse") process.exit(0);
  const toolInput = event.tool_input ?? {};
  const path =
    typeof toolInput.file_path === "string" ? toolInput.file_path : "";
  const patch =
    typeof toolInput.command === "string"
      ? toolInput.command
      : typeof toolInput.input === "string"
        ? toolInput.input
        : "";
  const touchesTypeScript =
    /\.[cm]?tsx?$/.test(path) ||
    /^\*\*\* (?:Add|Update|Delete) File: .*\.[cm]?tsx?\s*$/m.test(patch);
  if (!touchesTypeScript) {
    console.log("File quality hook: no TypeScript edit; skipped.");
    process.exit(0);
  }
  const result = spawnSync("npm", ["run", "quality:file"], {
    cwd: projectRoot,
    encoding: "utf8",
    timeout: 27_000,
    maxBuffer: 1_000_000,
  });
  if (result.status !== 0 || result.error) {
    console.error(
      "TypeScript quality gate failed after edit. Fix errors before continuing.",
    );
    console.error(result.stdout ?? "");
    console.error(result.stderr ?? "");
    if (result.error) console.error(result.error.message);
    process.exit(2);
  }
  console.log(result.stdout);
} catch (error) {
  console.error(`Quality hook could not validate input: ${error.message}`);
  process.exit(2);
}
