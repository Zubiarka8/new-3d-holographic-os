# Real agent coordination

The current task explicitly requests delegation. Codex offers `collaboration` tools and declares `multi_agent stable true`. The ORCHESTRATOR keeps integration, diff review and the acceptance decision. The roles are not fictitious processes or installed persistent agents; they are responsibilities assigned to subagents of this session or executed sequentially.

| Responsibility                        | Work boundary                                                                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| ORCHESTRATOR / FRONTEND ARCHITECT     | Root, dependencies, state control, interface, integration; review of deliveries                                                                   |
| GRAPHICS ENGINEER / SHADER SPECIALIST | Scene, core, orbitals, particles, shaders and GPU resources; typed contract with the controller                                                   |
| ART DIRECTOR / INTERACTION ENGINEER   | Art direction and visual states; interaction shared with the integrator through a contract, without editing other people's files at the same time |
| Tooling                               | Only `ENVIRONMENT_AUDIT.md`, `TOOLING_MATRIX.md`, `HOOKS.md`, `MULTI_AGENT.md` and five skill packages                                            |
| QA ENGINEER / PERFORMANCE ENGINEER    | Tests, captures, console and measurements; reports defects to the owner before editing their modules                                              |

The exact boundaries are assigned through collaboration messages. Only the owner writes each file during their task; the integrator may modify it after delivery. The directory and the task branch are shared: duplicating installations is not necessary, and this still does not allow overwriting other people's changes. There are no implicit commits, pushes or publication.

The application state is the single source of mode, intensity and preferences. The scene receives state and publishes real measurements; it does not import DOM. The interface uses semantic controls and events; it does not query internal details of materials. QA observes behavior and failures, without turning private class names into acceptance criteria. Commands, captures and blockers are delivered with the review; a subagent's success message does not replace checking its files.
