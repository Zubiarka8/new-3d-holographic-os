# Measured performance — 2026-10-16

Machine: Apple M4 (`sysctl machdep.cpu.brand_string`), macOS 27.0, arm64. Playwright 1.64.1 WebKit 27.2, headless; viewport 1440 × 1000, DPR 1, canvas 786 × 678. No private GPU identification was queried.

Method: `node scripts/measure-performance.mjs`, local Vite server. Per mode: 2 s warm-up and 5 s of requestAnimationFrame intervals, with no captures or traces during sampling. About 300 intervals per mode. Raw data in [performance.json](../artifacts/performance.json). This is not GPU time, a prolonged thermal test or a measurement of initial loading on a mobile network.

| Mode      | Mean RAF FPS | Mean frame |   p50 |   p95 | Draw calls | Particles |
| --------- | -----------: | ---------: | ----: | ----: | ---------: | --------: |
| STANDBY   |        59.99 |   16.67 ms | 17 ms | 18 ms |         23 |     1,500 |
| ANALYSIS  |        60.01 |   16.66 ms | 17 ms | 18 ms |         23 |     1,500 |
| OVERDRIVE |        59.99 |   16.67 ms | 17 ms | 18 ms |         23 |     1,500 |

Result: the initial 60 FPS target was observed on this machine and configuration during this short window. Capture automation does introduce load and its instantaneous counters can drop; those captures are not used as a benchmark.

Implemented budgets: maximum DPR 1.75; DPR drops in 0.25 steps if three consecutive samples fall below 38 FPS; minimum 1. The particles are a single Points object with a GPU shader and reused geometry. Pause/reduced motion freeze movement and avoid automatic DPR changes; a hidden tab does not render. There are no heavy textures, dynamic shadows or bloom post-processing. The glow comes from the additive shader.

Initial bundle: 557.68 kB minified JavaScript / 141.60 kB gzip; Vite emits a warning above 500 kB. It is kept visible; the scene is the main content. Fonts are served locally. The reference PNGs are not included in the runtime.

Resource management reviewed: dispose cancels RAF, disconnects the ResizeObserver, removes listeners and releases geometries, materials and the renderer. HMR invokes it. The absence of long-term leaks is not claimed: no heap/GPU profile or thermal test was run. No physical phone, battery, WebGPU, Firefox, Chrome or user Safari was measured. Mobile was verified as a 390 × 844 WebKit viewport, not as mobile hardware.
