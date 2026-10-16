# Codex workflow

## 1. Orientation and planning

Read [AGENTS.md](../AGENTS.md), inspect files and other people's changes, check the branch and the commands that are actually available. Read only the relevant documents. For complex tasks, write small steps with observable criteria, dependencies and risks; resolve routine decisions without needlessly stopping the work.

The MASTER PROMPT must specify the phase, expected interaction, art references, target devices and acceptance criteria. If doubts remain, advance on the independent parts and point out which decision is missing.

## 2. Incremental implementation

Create a branch from `main` when Git is operational. Implement one verifiable capability at a time, preserving the boundaries of the [architecture](ARCHITECTURE_PLAN.md). Check primary documentation and versions before adding packages; review install scripts and keep the lockfile. Add instructions and configuration together with the capability they describe.

## 3. Checks

In phase 0: review content, paths, ignore rules, TOML schema, absence of secrets and respect for scope. No npm commands are available.

When the application is created, propose and define these scripts **before using them**:

| Proposed script | Expected behavior                                            |
| --------------- | ------------------------------------------------------------ |
| `typecheck`     | TypeScript with no emit and strict enabled                   |
| `lint`          | Rules of the selected stack; errors cause a non-zero exit    |
| `build`         | Real production build                                        |
| `test`          | Relevant behavior tests, when they exist                     |
| `test:e2e`      | Real flows with Playwright in an allowed browser             |
| `test:visual`   | On-demand comparison against reviewed baselines              |
| `check`         | Composition of the available checks, with failure propagated |

Do not create scripts that return success without checking anything. Do not update baselines to hide errors. In code, validate the change with proportionate tests and record earlier failures separately. A dependency audit does not prove the absence of vulnerabilities; review scope and update without indiscriminate forced changes.

## 4. Visual inspection and correction

Use an authorized browser with an isolated test profile. Chrome and its extension require explicit authorization in the current task; a generic request for visual review does not grant it. Firefox/WebKit are alternatives that must be installed and verified. In this phase no browser is opened.

For a future scene: start a local server, wait for assets, fix the viewport, seed and clock; check console, loading, real interaction, keyboard, touch, reduced motion and degradation without GPU. Capture evidence and record the browser, hardware, preset and resolution. Measure performance outside heavy instrumentation. Fix and repeat only the affected checks.

If the browser or GPU is not available, document the pending validation; do not declare visual quality approved by reviewing code.

## 5. Review and integration

Review the full diff, new files, whitespace, credentials and paths. Ensure lockfiles and shared configuration are not ignored. Document changes, commands run, results, limits and the next step. Commits, pushes, PRs and publication need the corresponding authorization; do not rewrite history or force-push.

## Phase 0 recovery history

The working folder arrived empty, without `.git`. GitHub confirmed `main` with `LICENSE` and `README.md`. The license was restored and the README was expanded. The shell network does not resolve GitHub; the GitHub integration does allow reads. `git init -b main` failed because of a permission error creating `.git`; no alternative history was created.

When the environment allows Git and has network access, clone the remote into a new folder, check its state and copy these reviewed files there. Keep its `.git` and its license; create a `chore/phase-0-bootstrap` branch from the recovered `main`. Compare the remote again because it may have changed. Do not initialize an independent history or overwrite remote changes.

Project configuration is also pending: `.codex` is read-only. With write permission, review [the template](codex/config.example.toml) and merge it into `.codex/config.toml`. Codex only loads trusted project layers. Review trust in the client; do not modify global configuration automatically. Enable only the necessary MCP and check its connection; no connection of the candidates has been demonstrated.

## Quality automation (phase 0)

Codex 0.163.0 declares hooks as stable and active. Global start, end-of-turn and end-of-subagent hooks exist; they were inventoried without running them manually or copying them. Project hooks require trust and review of their definition; see the [official documentation](https://learn.chatgpt.com/docs/hooks).

No hooks are added in phase 0: there are no application commands to run yet. Once real scripts exist, prioritize manual execution and per-pull-request CI, with minimal read permissions and actions pinned to a reviewed SHA. Any end-of-turn hook must be bounded and must not repeat heavy builds after every edit. Visual checking will remain on demand. Hooks do not replace the security restrictions of the environment.

## State after construction — 2026-10-16

Git is operational on `feat/new-3d-holographic-os`, dependencies are installed and the application was tested with WebKit. The historical restrictions in this document do not replace [the current audit](ENVIRONMENT_AUDIT.md). See [real hooks and commands](HOOKS.md), [acceptance](ACCEPTANCE.md) and [performance](PERFORMANCE.md). No commits or publications are made without authorization.
