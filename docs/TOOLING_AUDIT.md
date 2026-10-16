# Operational audit — 2026-10-16

> Initial phase 0 document kept as history. For the implemented state, see [acceptance](ACCEPTANCE.md), [architecture](ARCHITECTURE.md) and the [current audit](ENVIRONMENT_AUDIT.md).

## Repository and preservation

| Item                 | Evidence / status                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Remote               | [Zubiarka8/new-3d-holographic-os](https://github.com/Zubiarka8/new-3d-holographic-os), public, confirmed through the GitHub integration |
| Main branch          | `main`; the only branch returned by the API, unprotected according to that response                                                     |
| Observed commit      | Initial commit with no parents (the history was later reset to a single clean commit)                                                   |
| Remote files         | `LICENSE` (MIT, 1076 bytes) and `README.md` (8 bytes); no code, dependencies, workflows or agent configuration                          |
| Initial local folder | Empty, without `.git`; there were no local changes to overwrite                                                                         |
| Preservation         | Original license recovered; original README title kept and expanded                                                                     |
| Local Git            | `git status` not applicable: not a repository; creation of `.git` denied by the sandbox                                                 |
| Shell network        | `gh api`, `git ls-remote` and `curl` could not connect to/resolve GitHub; the session's GitHub integration did respond                  |

Blobs, tree and commit reconstruction were checked against their hashes before the initialization attempt; the blocker occurred when creating `.git`, without importing objects or creating commits. The signature was not independently verified cryptographically. File preparation is local; its content has not been published on GitHub.

### Requested rename

On 2026-10-16 the repository was renamed to `Zubiarka8/new-3d-holographic-os` through the GitHub API and it was confirmed that it keeps its ID and the `main` main branch. The project identity and the MCP identifiers in the inactive template were updated. The `gh api` connection worked in this operation; the earlier network failure belongs to the initial audit. Renaming the local directory was denied by the sandbox because it required write access to the parent folder and remains pending. No commits or pushes were made.

## Codex installation and real configuration

- CLI: `codex-cli 0.163.0`, npm package `@openai/codex`; `codex --help`, `codex features list` and `codex mcp --help` executed.
- Local tools checked: Node `v24.12.0`, npm `11.6.2`, Git `2.54.0`, gh `2.101.0`; Python 3 and `rg` available. Compatibility of the future stack is not inferred from their mere presence.
- `~/.codex/config.toml` exists. Keys and metadata were inspected without dumping credential values, private arguments or provider endpoints. Configured model: `gpt-6.1-sol`; this is a user preference, not a project requirement.
- The user configuration contains providers, projects, plugins, skills, apps, MCP and hooks. No global setting was modified and the authentication store was not read.
- A `~/.codex/AGENTS.md` exists with restrictions on Chrome and on skill consultation; the project contract preserves them.
- The current environment imposes granular permissions, restricted network and limited writes. TOML settings do not replace those restrictions.

| Mechanism         | Verified compatibility and decision                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`       | Persistent, hierarchical instructions supported; contract created at the root                                                                        |
| Project           | `.codex/config.toml` supported for trusted projects; `.codex` is read-only here                                                                      |
| User              | `~/.codex/config.toml` exists; left intact                                                                                                           |
| Skills            | `SKILL.md`, local discovery and plugins available; no new installations                                                                              |
| MCP               | CLI management, stdio and HTTP documented; separate inventory below                                                                                  |
| Subagents         | `multi_agent` stable and active; collaboration tools exposed in this session. No delegation executed and no roles installed                          |
| Execution and Git | Shell, patches, image reading and Git tools available; permissions and connectivity limit Git in this folder                                         |
| Browser           | Computer use and browser tools exposed; they were not opened or verified. Chrome requires explicit current authorization                             |
| Hooks             | `hooks` stable and active; global file with `SessionStart`, `Stop`, `SubagentStop` events. Trust and execution are not demonstrated by the inventory |

Before writing [the TOML template](codex/config.example.toml), the [official schema pinned to 0.163.0](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/core/config.schema.json) was consulted, as well as the [published schema](https://learn.chatgpt.com/docs/config-schema.json). Only `mcp_servers`, `url`, `command`, `args` and `enabled` are used. No keys from other agents, broad permissions, mandatory model or automatic trust are added. Both servers remain disabled.

The template in `docs/` **is not active configuration**. Its activation is pending permitted write access to `.codex`, review and project trust; there is no evidence of a handshake or execution of those MCPs.

## Skills: availability and selection

AVAILABLE means exposed in this session's catalog or present on disk, not executed or certified. RECOMMENDED is a candidate that can be reviewed for a future phase. MISSING indicates absence from the inspected inventory, not public non-existence. REJECTED identifies a decision not to incorporate.

| Capability / skill                                                   | Status                                  | Decision and evidence                                                                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openai-docs`, `skill-installer`, `skill-creator`                    | AVAILABLE                               | System skills; the first two were read for documentation and installation, with nothing installed                                                     |
| `imagegen`                                                           | AVAILABLE                               | Session catalog; candidate for concept art, not used or inspected in depth                                                                            |
| Frontend: `hodios-software-engineering:build-ui-component`           | AVAILABLE                               | Local metadata verified; typing and accessibility. Explicit invocation; not executed                                                                  |
| Architecture: `hodios-software-engineering:review-system-design`     | AVAILABLE                               | Metadata verified; useful for reviewing future decisions                                                                                              |
| Accessibility: `hodios-software-engineering:audit-web-accessibility` | AVAILABLE                               | Metadata verified; review markup and WCAG criteria once a UI exists                                                                                   |
| Performance: `hodios-software-engineering:improve-web-vitals`        | AVAILABLE                               | Metadata verified; requires real reports and does not replace GPU profiling                                                                           |
| GitHub: `hodios-software-engineering:write-github-actions-workflow`  | AVAILABLE                               | Metadata verified; wait for real scripts before creating CI                                                                                           |
| UI/UX and art direction                                              | AVAILABLE partial / MISSING specialized | Components and image generation exist; a specialized cinematic design skill was not verified                                                          |
| Three.js, WebGL, GLSL, WebGPU and shader engineering                 | MISSING                                 | No specialized skill identified in the session catalog. Use primary documentation and develop an own procedure only when repeated work appears        |
| Visual testing: `openai/skills` → `playwright`                       | RECOMMENDED                             | Present in the remote official catalog; not installed and its execution not reviewed. Read it before installing and adapt it to an authorized browser |
| Official `playwright-interactive` and `screenshot`                   | RECOMMENDED conditional                 | They exist in the catalog; do not add them together with Playwright unless there is a concrete need for interactive inspection/capture                |
| Unknown shader and agent packs                                       | REJECTED                                | Provenance, maintenance and compatibility not verified; do not incorporate                                                                            |
| Cursor/Claude skills or automatic deployment                         | REJECTED for phase 0                    | They do not correspond to the requested bootstrap                                                                                                     |

The five engineering skills above belong to the already available third-party plugin `hodios-software-engineering` (local catalog `2026.1014.1`, CC0-1.0 metadata). They are not official OpenAI skills. Only their metadata was reviewed; this does not audit all their procedures or resources.

Minimal selection: reuse available capabilities on request and consider **one** official Playwright skill when starting application validation. It is not necessary to install a graphics pack to start the prototype.

Official mechanism: [Codex skills](https://learn.chatgpt.com/docs/build-skills) and the [OpenAI catalog](https://github.com/openai/skills/tree/main/skills/.curated). The supplied `skill-installer` can list the catalog through `scripts/list-skills.py` and install with `scripts/install-skill-from-github.py --repo openai/skills --path skills/.curated/playwright --ref <reviewed-revision>`. These are paths relative to that system skill; they are not project scripts. Its default destination is global, so they were not run. Review the content, license, scripts and exact revision before authorizing installation. For own shared instructions, Codex discovers `.agents/skills/<name>/SKILL.md` inside the repository; there are no own procedures yet that justify creating it.

## Configured MCPs, session tools and candidates

Global inventory read from TOML: `obscura` (stdio) and `node_repl` (stdio), both without `enabled=false`. They were not started and their health was not verified. `node_repl` points to the application's computer use runtime; `obscura` to a local installation of unaudited provenance. Their existing configuration is not replicated in the project and no permissions are expanded.

The session also exposes a GitHub integration, web search, image reading, image generation and computer use. This does not imply that they are servers declared in the user's TOML or that they are available in a fresh clone. GitHub was verified by reading metadata, branches and files; write operations were not tested.

| Candidate / origin                                                       | Compatibility, installation and maintenance                                                                                                                                   | Access and credentials                                                                                                                                                                     | Decision                                                                                                          |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [Playwright MCP, Microsoft](https://github.com/microsoft/playwright-mcp) | stdio MCP compatible with Codex; package `@playwright/mcp`, official release observed [v0.0.83](https://github.com/microsoft/playwright-mcp/releases/tag/v0.0.83), 2026-09-28 | Runs Node and controls a browser; it can read content and send data. No token for localhost; requires a compatible browser. Use an isolated profile, no CDP, extension or personal cookies | Disabled template with pinned version and headless Firefox; installation, dependency review and handshake pending |
| [GitHub MCP, GitHub](https://github.com/github/github-mcp-server)        | Maintained official project; remote HTTP server or local binary/container compatible at the transport level                                                                   | OAuth authentication depending on the client, or PAT; restrict to the repository and necessary permissions, initially read-only. Keep the credential out of the repo                       | Pending; the existing GitHub integration already covers the audit. Do not enable a duplicate or create a token    |
| [Docs MCP, OpenAI](https://developers.openai.com/learn/docs-mcp)         | Official public HTTP service at `https://developers.openai.com/mcp`; no local package installation                                                                            | Read-only documentation; no token required according to the official public configuration. Queries leave for the service                                                                   | Disabled template; useful for Codex maintenance, optional for the web app. Connectivity not checked               |
| Three.js / WebGPU / GLSL documentation                                   | Browsing of primary sources through the available web search                                                                                                                  | Reading public documentation; no credentials                                                                                                                                               | Prefer direct official documentation; no other general-purpose MCP is needed                                      |
| Visual inspection                                                        | Image reading available; future screenshots through Playwright                                                                                                                | Access to local images and the test browser                                                                                                                                                | Reuse existing capabilities; do not install an additional server                                                  |
| General access to filesystem, databases or cloud                         | No concrete need for this phase                                                                                                                                               | Would widen the surface and possible credentials                                                                                                                                           | REJECTED for phase 0                                                                                              |

The pinned Playwright version limits changes of the main package; it **does not pin transitive dependencies**. When incorporating tooling into the application, prefer an exact local dependency with a lockfile. Do not run the template's `npx` until that step is reviewed. No packages, browsers, servers or extensions were installed. The documentary inspection was done through web search/reading tools, without controlling Chrome.

## Hooks and automation

Support checked against the CLI and the [official hooks documentation](https://learn.chatgpt.com/docs/hooks): `.codex/hooks.json` or `[hooks]` tables are native mechanisms; unmanaged definitions need trust review. The global hooks found do not prove that a project hook will run here. Schemas from Claude Code or Cursor are not copied.

Decision: do not add empty hooks or heavy tasks without an application. Future type, lint, build, test, diff review, dependency and visual validation checks are defined in [the workflow](CODEX_WORKFLOW.md). First verifiable scripts and CI on demand for changes; optional hooks afterwards, with bounded execution. No build after every modification.

## Validation and limits

| Check performed     | Result                                                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final inventory     | 10 files: 9 new or expanded relative to the remote and an identical license                                                                                             |
| Agent contract      | Reviewed: phase 0, Chrome/skills restrictions, permissions and Git workflow consistent                                                                                  |
| Original license    | Blob SHA-1 `7a8edc6be2135622e36eae7cfe3f8bf379346ab9`, identical to the remote                                                                                          |
| Documentation paths | 23 relative links checked and existing; future paths identified as proposals                                                                                            |
| `.gitignore`        | 69 cases with `git check-ignore --no-index` in an isolated temporary repository: secrets/outputs excluded; lockfiles, examples, baselines and shared configuration kept |
| TOML                | Parsed with `tomllib`; fields and types used checked against the official 0.163.0 schema; equivalent overrides accepted by the CLI                                      |
| CLI strict mode     | `codex --strict-config … features list` rejected because that subcommand does not support strict mode; it is not presented as strict validation or project activation   |
| Change review       | `git diff --no-index` comparison against recovered original files and whitespace check; Git in the folder remains blocked                                               |
| Secrets             | No matches for common token, private key and credential patterns; content review found no secrets. This is not an exhaustive certification                              |
| Scope               | No web code, manifest, dependencies, graphical assets, modules or open browser                                                                                          |

The temporary validation does not write to the folder's `.git` or modify global settings. No web server, application tests or graphical validation are possible in this phase. Package availability on npm, MCP startup, browsers and GPU were not checked.

Operational pending items: recover a Git clone preserving history, create a preparation branch and activate project configuration in an environment that allows writes. Pending items for the build: MASTER PROMPT, choice of versions and framework, hardware/browsers, budgets and validation of any tools that get enabled. No commits, pushes, publication or global changes.

## Sources and validity

Consulted on 2026-10-16. Review again when updating the CLI: [official AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [configuration layers and trust](https://learn.chatgpt.com/docs/config-file/config-basic), [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli). The skills, hooks and server links above document each decision; the installed version data comes from local commands, not from inferences about the latest public version.
