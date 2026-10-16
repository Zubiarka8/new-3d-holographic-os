# Art direction — New 3D Holographic OS

Date: 2026-10-16. Project: New 3D Holographic OS.

The experience presents a spatial instrument that the visitor can manipulate. The core takes up the largest visual area; the interface explains its state and allows changing it. The composition combines cinematic scale, wide darkness and fine luminous details.

## Generated references

Five real PNGs were generated with the built-in `image_gen.imagegen` tool, without a CLI, API key or downloaded assets. They were copied to the repository and inspected visually. The full prompts are in [assets/references/PROMPTS.md](../assets/references/PROMPTS.md).

| Reference          | Intent                                                 |
| ------------------ | ------------------------------------------------------ |
| `01-standby.png`   | Central core, side hero, rest state and orbital depth  |
| `02-analysis.png`  | Reading layers and cyan exploration plane              |
| `03-overdrive.png` | Optical intensity, orbital expansion and violet accent |
| `04-detail.png`    | Fresnel material, topology and inner filaments         |
| `05-mobile.png`    | Vertical hierarchy, scene and stacked controls         |

They are visual concepts, not application screenshots or evidence of features. The text, figures and navigation invented by the generator are not carried into the product as fictitious telemetry or controls. No human approval of a specific reference exists yet.

## Visual language

- Background `#080C14`; translucent dark surfaces with a thin border and sufficient contrast.
- Cyan `#66E8FF` as the active signal; violet `#B18AFF` for depth and higher energy; white `#E6F7FF` for reading and points of maximum emission.
- Core with real volume, procedural surface and Fresnel edge; filaments or inner lines that reinforce depth without hiding the silhouette.
- Inclined rings of different radii, with arcs and orbital points. Avoid turning every element into flat concentric circles.
- Fine, sparse particles near the text. Separate background particles from the main structure through size, brightness and depth.
- Light, wide typography for the headline "A new dimension of control."; compact, spaced technical labels, with readable main content.

## States and motion

STANDBY maintains a slow breathing, cyan lighting and stable dispersion. ANALYSIS increases structural readability and emphasizes layers and orbits. OVERDRIVE expands the energy, speeds up motion in a limited way and adds violet; it preserves detail in the highlights.

Transitions interpolate position, scale, color and intensity. Dragging rotates the structure; the cursor introduces subtle parallax. State changes must be visible immediately and confirmed through accessible text. With reduced motion, suppress continuous movement and keep state changes legible.

## Responsive composition

On desktop, the core dominates the center and right area; the headline breathes on the left and the controls sit on dark surfaces. On mobile, the order is brand, headline, scene, modes and panels. The canvas must not push controls out of the viewport or block vertical scroll. Do not reproduce the microscopic font size of the references.

## Review criteria

1. Volume and several orbital planes are recognizable without interaction.
2. The three modes can be told apart without relying on color alone.
3. Brightness preserves the silhouette and allows reading all controls.
4. No overlaps between headline, core and panels on desktop or mobile.
5. Dragging and energy change the real render; the scene keeps responding after several transitions.
6. Screenshots are recorded with viewport and state, plus an interactive sequence and the device limitations. A single capture does not validate performance.

The references guide composition and materials. The first version may simplify filaments and refraction to respect GPU and accessibility budgets; any material difference is evaluated on the running application.

The five PNGs are kept only locally (they are not versioned): they contain the project's previous name inside the image and cannot be edited; they should be regenerated with the prompts in `PROMPTS.md`.
