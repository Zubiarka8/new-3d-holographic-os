# New 3D Holographic OS

**🔗 Live demo: [https://zubiarka8.github.io/new-3d-holographic-os/](https://zubiarka8.github.io/new-3d-holographic-os/)**

**New 3D Holographic OS** is an interactive, runnable holographic experience built with Three.js, WebGL and custom GLSL shaders.

## Run

Requires Node >=22.12 (verified with 24.12) and npm. From this folder:

```sh
npm ci --ignore-scripts
npm run dev
```

Open the local URL shown by Vite. Drag the core, or focus the scene and use the arrow keys. Home and Reset restore the orientation. The Standby, Analysis and Overdrive modes, intensity, pause, particles and grid change the real state. Capture downloads a PNG. Reduced motion respects the system preference and the explicit control.

```sh
npm run check
npm exec playwright -- install webkit
npm test
npm run quality:completion
```

The test suite uses WebKit exclusively. It does not open Chrome. `npm run build` generates `dist/`; `npm run preview` serves the production build locally. GitHub Actions publishes `main` at [zubiarka8.github.io/new-3d-holographic-os](https://zubiarka8.github.io/new-3d-holographic-os/). No backend or credentials are needed. Fonts are served locally.

## Evidence and limits

See [acceptance](docs/ACCEPTANCE.md), [performance](docs/PERFORMANCE.md) and [real screenshots](artifacts/screenshots/desktop-analysis.png). The five AI concepts in `assets/references/` are art-direction references, not application screenshots or approved baselines; they are kept locally and are not versioned.

Without WebGL the interface is preserved and an explanation is shown. Local validation does not guarantee 60 FPS on other devices. Five skills are registered in `.agents/skills/` and the local hook is installed and tested.

## Documentation

- [Contract](AGENTS.md) and [workflow](docs/CODEX_WORKFLOW.md).
- [Environment audit](docs/ENVIRONMENT_AUDIT.md), [tooling matrix](docs/TOOLING_MATRIX.md), [hooks](docs/HOOKS.md) and [multi-agent](docs/MULTI_AGENT.md).
- [Art direction](docs/ART_DIRECTION.md), [implemented architecture](docs/ARCHITECTURE.md) and [vision](docs/PROJECT_VISION.md).
- [Historical phase 0 audit](docs/TOOLING_AUDIT.md) and [initial roadmap](docs/IMPLEMENTATION_ROADMAP.md).

Repository: [Zubiarka8/new-3d-holographic-os](https://github.com/Zubiarka8/new-3d-holographic-os). The earlier documentation preparation is kept and marked as historical where applicable.

## License

[MIT](LICENSE), copyright 2026 Arkaitz Zubizarreta. Font licenses are in `public/fonts/`.
