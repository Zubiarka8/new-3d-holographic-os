# Planned architecture

> Initial phase 0 document kept as history. For the implemented state, see [acceptance](ACCEPTANCE.md), [architecture](ARCHITECTURE.md) and the [current audit](ENVIRONMENT_AUDIT.md).

## Confirmed decisions

| Decision                                                        | Reason                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| Web application with real Three.js / WebGL rendering            | Project requirement; no implementation yet                          |
| Strict TypeScript                                               | Verifiable contracts between scene, state and interface             |
| Decoupled modules                                               | Ability to replace effects without modifying interaction or content |
| Accessibility and progressive degradation                       | Keep essential functions across different capabilities              |
| Versioned configuration and lockfile once an application exists | Reproducible installation and dependency review                     |
| Existing MIT license                                            | Preserve the original terms                                         |

## Proposals to resolve with the MASTER PROMPT

| Proposal                                                 | Pending decision / experiment                                                                             |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Vite and npm                                             | Confirm framework and compatible versions before creating the manifest and lockfile                       |
| DOM with TypeScript; React only if UI state justifies it | Choose based on complexity, avoiding React Three Fiber by default                                         |
| WebGL as the baseline; WebGPU optional                   | Test capabilities and material/shader compatibility; do not assume automatic GLSL to WGSL/TSL translation |
| One central clock and render loop                        | Verify pause when the tab is hidden, bounded time delta and cleanup                                       |
| Explicit state with input adapters                       | Choose minimal state without a global library initially                                                   |
| CSS for UI; animation coordinated with the scene clock   | Add an animation library only for a demonstrated need                                                     |
| Vitest and Playwright as candidates                      | Confirm unit-test needs, authorized browser and deterministic snapshots                                   |
| Static hosting                                           | Resolve provider, routes, cache and headers before production                                             |

No versions have been chosen and no dependencies installed. Consult the primary documentation of the chosen stack before pinning them.

## Future module boundaries

1. **Platform:** startup, capability detection, sizes, clock and lifecycle.
2. **Rendering:** renderer, camera, scene, materials and GPU resources. Exposes commands; does not manipulate the controls' DOM.
3. **Domain:** state and interaction intents with no renderer dependencies.
4. **Input:** pointer, keyboard and touch translated into intents; arbitration between gestures and scroll.
5. **Interface:** semantic DOM, focus, announcements and motion preferences.
6. **Quality and resources:** presets, progressive loading, DPR limits, release of geometries, materials, textures and listeners.

Startup will compose these modules. Share small contracts; avoid singletons that mix scene, UI and state. Create folders only when implementing their first responsibility.

## Risks and planned verification

- Transparency, overdraw and bloom: measure GPU and legibility before increasing particles.
- Shaders: verify compilation on target browsers and devices; do not rely only on screenshots.
- Mobile power and temperature: per-preset budgets and load reduction when the scene is not visible.
- Accessibility: essential actions outside the canvas, keyboard and screen reader testing.
- Visual regression: fixed seed, controlled time, loaded assets and same viewport; compare differences with justified tolerances.

Record new decisions in this document with date, options considered, reason and how to verify them; always keep a proposal separate from an implemented decision.

Primary sources: [Three.js](https://threejs.org/docs/) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Delivery procedure: [CODEX_WORKFLOW.md](CODEX_WORKFLOW.md).
