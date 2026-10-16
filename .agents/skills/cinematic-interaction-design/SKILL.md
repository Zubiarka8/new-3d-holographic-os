---
name: cinematic-interaction-design
description: Implement cinematic drag, parallax and mode transitions with keyboard equivalents and reduced motion support.
---

Goal: every control produces a real, continuous and accessible change in the scene.

Activation: new controls, gestures, spatial navigation or transitions.

Allowed tools: Pointer Events, semantic DOM, TypeScript, RAF and Playwright WebKit; animation dependencies only when there is a concrete need.

Procedure:

1. Identify the state, limits and visible response of each action; share a single source of truth between the UI and the scene.
2. Implement native controls for mode and intensity; visible focus and programmatic labels. Add keyboard equivalents for drag rotation.
3. Use pointer capture for drag, handle cancellation and distinguish canvas interaction from mobile scroll. Keep parallax bounded.
4. Interpolate parameters using time delta, allow the target to change mid-transition and avoid jumps. Reduce or stop non-essential motion with prefers-reduced-motion and an explicit pause.
5. Verify mode, energy range, drag, keyboard, mobile and rapid sequences in a browser.

Deliverables: a decoupled controller, transition parameters and tests of observable behavior.

Verification: no decorative controls; the keyboard reaches and operates every action; clean cancellation; energy/mode reflected in the scene and the UI.

Restrictions: do not block document scrolling for an ornamental effect; do not hide essential information behind hover; do not invent telemetry or claim tested interaction without running it.
