import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
const failures = [];
for (const file of files) {
  if (
    !statSync(file).isFile() ||
    statSync(file).size > 2_000_000 ||
    /\.(png|jpg|webp|woff2?)$/.test(file)
  )
    continue;
  if (
    /(^|\/)(\.env(?:\.|$)|auth\.json|credentials\.json)|\.(pem|key|p12|pfx)$/.test(
      file,
    ) &&
    !file.endsWith(".example")
  )
    failures.push(`${file}: sensitive filename`);
  const content = readFileSync(file, "utf8");
  if (
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content) ||
    /(?:gh[pousr]_[A-Za-z0-9]{30,}|sk-proj-[A-Za-z0-9_-]{30,})/.test(content)
  )
    failures.push(`${file}: potential credential`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Sensitive file check passed (${files.length} files; heuristic, not a security certification).`,
  );
