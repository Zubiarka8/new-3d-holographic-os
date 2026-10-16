---
name: visual-fidelity-auditor
description: Inspect screenshots and sequences of the WebGL experience to detect and fix composition, responsive and state defects.
---

Goal: verify the visual experience and interaction through reproducible evidence.

Activation: visual checkpoint, scene change or responsive review; it does not replace behavior tests.

Allowed tools: installed and verified Playwright Test WebKit/Firefox, local screenshots, view_image and authorized references. Do not use Chrome or personal profiles without explicit authorization.

Procedure:

1. Run the local server and record browser/versions, device, viewport, DPR, mode, energy and motion policy. Wait for the scene to be ready.
2. Capture the initial state, each mode, after interaction and mobile. Check the console and shader errors in addition to screenshots.
3. Observe an animated sequence and exercise controls, drag and keyboard. A single screenshot does not demonstrate functionality or FPS.
4. Compare existing references by hierarchy, volume, lighting, legibility and coherence. If there is no approved reference, state so and use written criteria.
5. Prioritize defects with evidence; fix the three most important within scope, repeat the affected checks and keep real blockers.

Deliverables: screenshots with parameters and a report of defects/results in the acceptance documentation.

Verification: no overlaps or overflow, differentiated modes, readable and functional controls, fallback/reduced motion checked.

Restrictions: do not update baselines to hide failures, do not equate a generated reference with approval and do not declare the GPU engine tested when a fallback occurred.
