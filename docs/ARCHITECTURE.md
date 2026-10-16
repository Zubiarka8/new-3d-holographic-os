# Implemented architecture — 2026-10-16

Vite 8.3.4, strict TypeScript 6.0.3 and Three.js 0.186.1. Versions checked on npm before installing; `--ignore-scripts` avoids lifecycle scripts. TypeScript 7.0.2 was rejected because of the peer range of typescript-eslint 8.71.2, without forcing resolution. Reproducible lockfile. No React, GSAP or remote backend: native DOM and RAF cover this version.

- `main.ts`: composition and HMR teardown.
- `app/StateMachine.ts`: explicit state, modes and energy limits.
- `app/AppController.ts`: connects intents, UI, system preferences and renderer; keeps the no-GPU fallback.
- `ui/Interface.ts`: semantic content and native controls. The signal graphics are ornamental and aria-hidden; they do not represent hardware measurements.
- `interactions/PointerController.ts`: Pointer Events, capture/cancellation, keyboard, reset and cleanup.
- `graphics/SceneManager.ts`: single clock, camera, resize, renderer, context loss/restoration, DPR limits, metrics and dispose. API `setState`, `rotate`, `resetView`, `capture`, `dispose`.
- `graphics/OrbitalSystem.ts` and `ParticleSystem.ts`: reused geometries and materials, orbits and 1,500 particles with a stable seed.
- `shaders/core.*.glsl`: real Fresnel, temporal distortion and energy bands. The particle shader moves points on the GPU.
- `styles/styles.css`: responsive interface with local fonts, focus and reduced motion.

The UI controls `{mode, energy, paused, reducedMotion, particles, grid}`. A mode sets an initial intensity that the user can change. Mode transitions interpolate color, energy and procedural time. Rendering continues so that discrete actions apply during pause; time and parallax stay frozen. No scroll storytelling was added because it does not improve this compact workspace.

WebGL2 is the baseline; WebGPU support is not claimed. An initial context failure leaves the DOM controls available and explains the lack of graphics. Context loss shows the fallback and restoration removes it. Rendering is skipped when the document is hidden. Every geometry/material and listener is released in dispose. PNG capture renders and serializes in the same task, without a permanent preserveDrawingBuffer.

The generated references are outside the bundle. The app does not use concept images to fake volume. SIL OFL fonts and the repository's original license are preserved. No remote telemetry, credentials or paid services were added.

Costs: Three produces a bundle of roughly 557 kB minified (141 kB gzip, see the final build), with a Vite warning above 500 kB. This is a known initial-load limitation; it is not hidden by raising the threshold. This first version loads the scene immediately because it is the main content. The WebGL backend and the local typography need validation in more browsers/devices before promising general compatibility.

Primary sources: [Three.js](https://threejs.org/docs/), [Vite](https://vite.dev/guide/), [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict.html), [Playwright browsers](https://playwright.dev/docs/browsers).
