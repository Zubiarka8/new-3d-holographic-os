---
name: procedural-webgl-engineering
description: Implement or fix Three.js geometry, GLSL, orbitals and particles with explicit GPU resource management.
---

Goal: real procedural rendering with verifiable module boundaries.

Activation: changes to the scene, shaders, geometry, particles or the WebGL lifecycle.

Allowed tools: strict TypeScript, the project's Three.js and GLSL; primary documentation; build/typecheck and an isolated WebKit browser. WebGPU/TSL requires a demonstrated need and a compatibility path.

Procedure:

1. Inspect the state contract and the renderer API before editing. Keep DOM, interaction and scene separate.
2. Create geometries and materials once. Use uniforms for time, energy and mode; do not recreate them per frame.
3. Implement the core with volume, Fresnel, halo and coherent deformation. Particles in BufferGeometry/Points with GPU motion where appropriate; orbitals with independent orientation and speed.
4. Bound the time delta and pixel ratio. Pause when the document is hidden. Handle resize, contextlost, reduced motion and missing WebGL.
5. Release geometries, materials, the renderer and listeners on destroy. Verify the build and GLSL compilation in the browser, including mode changes.

Deliverables: typed modules, shaders and evidence of compilation/errors, documented graphics limits.

Verification: no WebGL/console errors, stable resources after interaction, authentic state and a readable fallback without GPU.

Restrictions: the Vite build does not validate GLSL; do not simulate successful compilation; do not add dependencies for looks or access private hardware.
