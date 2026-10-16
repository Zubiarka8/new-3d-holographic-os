# Implementation roadmap

> Initial phase 0 document kept as history. For the implemented state, see [acceptance](ACCEPTANCE.md), [architecture](ARCHITECTURE.md) and the [current audit](ENVIRONMENT_AUDIT.md).

The phases are incremental; do not anticipate code from later phases. Each delivery will update decisions, results and limitations. The MASTER PROMPT may adjust scope and order with justification.

| Phase                           | Deliverable                                                            | Exit criterion                                                                                                         |
| ------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1. Bootstrap (current phase 0)  | Contract, documentation, ignore rules and audit                        | Files reviewed; resolve Git binding and pending configuration before integration                                       |
| 2. Concept art                  | Art direction, composition, palette and reference states               | Coherent references, assets with provenance and artistic approval; do not confuse an image with a functional interface |
| 3. WebGL prototype              | Confirmed stack, reproducible installation, minimal scene and fallback | Real startup and build, adaptive canvas, resource cleanup, tests in an authorized browser                              |
| 4. Holographic core             | Geometry, materials, shaders and main states                           | Shader compilation and functional response verified in the agreed matrix                                               |
| 5. Particle system              | Emission, behavior and density presets                                 | Repeatability, resource limits and GPU budget measured                                                                 |
| 6. Spatial interface            | Coordinated DOM controls and spatial representation                    | Real actions, focus, keyboard, contrast and responsive behavior verified                                               |
| 7. Interactions                 | Pointer, touch and state transitions                                   | Complete, recoverable flows; no conflicts with scroll or accessible controls                                           |
| 8. Post-processing              | Selected effects and presets                                           | Artistic gain reviewed, cost measured and degradation by capability                                                    |
| 9. Visual validation            | Device matrix, captures and regression                                 | Comparable evidence, manual interaction and accessibility; differences reviewed                                        |
| 10. Optimization and production | Final budgets, loading, CI and publication strategy                    | Reproducible build, metrics, compatibility and deployment authorization                                                |

Accessibility, testing and performance are worked on from the prototype; phases 9 and 10 consolidate that evidence.

## Before the prototype

Confirm framework, versions, package manager, browsers and target hardware; choose benchmarks and budgets. Resolve Git and decide whether to enable any MCP. Global skills still require an explicit user request.

## State at the close of preparation

Documentation prepared; no visual phase started. No application, npm manifest, dependencies, application tests or deployment exist. Operational blockers and validations are in [TOOLING_AUDIT.md](TOOLING_AUDIT.md).
