import { StateMachine } from "./StateMachine";
import type { Mode } from "./StateMachine";
import { SceneManager } from "../graphics/SceneManager";
import { PointerController } from "../interactions/PointerController";
import { renderInterface } from "../ui/Interface";

export class AppController {
  private scene?: SceneManager;
  private pointer?: PointerController;
  private cleanup: (() => void)[] = [];
  constructor(root: HTMLElement) {
    renderInterface(root);
    const get = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;
    const text = (id: string, value: string) => {
      get(id).textContent = value;
    };
    const announce = (message: string) => text("announcement", message);
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const state = new StateMachine(motionQuery.matches);
    const canvas = get<HTMLCanvasElement>("scene");
    const unavailable = () => {
      text("render-status", "DOM MODE");
      text("engine", "UNAVAILABLE");
      text("pipeline-status", "NO GPU");
      get("capture").setAttribute("disabled", "");
      root.querySelector<HTMLElement>(".gpu-fallback")!.hidden = false;
      canvas.dataset.ready = "fallback";
    };
    try {
      this.scene = new SceneManager(canvas, (metrics) => {
        text("fps", String(metrics.fps));
        text("draw-calls", String(metrics.drawCalls));
        text("quality", metrics.quality);
        text("particle-count", metrics.particles.toLocaleString("en-US"));
      });
      text("render-status", "OPERATIONAL");
      text("engine", "THREE.JS / WEBGL2");
      text("pipeline-status", "CONNECTED");
      canvas.dataset.ready = "true";
    } catch (error) {
      console.warn("Graphics initialization unavailable:", error);
      unavailable();
    }
    canvas.addEventListener("graphics-unavailable", unavailable);
    this.cleanup.push(() =>
      canvas.removeEventListener("graphics-unavailable", unavailable),
    );
    const restored = () => {
      root.querySelector<HTMLElement>(".gpu-fallback")!.hidden = true;
      get("capture").removeAttribute("disabled");
      text("render-status", "OPERATIONAL");
      text("engine", "THREE.JS / WEBGL2");
      text("pipeline-status", "CONNECTED");
      canvas.dataset.ready = "true";
    };
    canvas.addEventListener("graphics-restored", restored);
    this.cleanup.push(() =>
      canvas.removeEventListener("graphics-restored", restored),
    );
    const report = (x: number, y: number, input: string) => {
      text(
        "orientation",
        `${Math.round(x * 0.286)}° / ${Math.round(y * 0.286)}°`,
      );
      text("coord-x", (x * 0.005).toFixed(2));
      text("coord-y", (y * 0.005).toFixed(2));
      text("input-channel", input);
    };
    this.pointer = new PointerController(
      canvas,
      (dx, dy) => this.scene?.rotate(dx, dy),
      () => this.scene?.resetView(),
      report,
    );
    const listen = (id: string, event: string, callback: EventListener) => {
      const element = get(id);
      element.addEventListener(event, callback);
      this.cleanup.push(() => element.removeEventListener(event, callback));
    };
    this.cleanup.push(
      state.subscribe((s) => {
        this.scene?.setState(s);
        root.dataset.mode = s.mode;
        get<HTMLOutputElement>("energy-output").innerHTML =
          `${Math.round(s.energy * 100)}<span>%</span>`;
        get<HTMLInputElement>("energy").value = String(
          Math.round(s.energy * 100),
        );
        text(
          "energy-level",
          s.energy > 0.8
            ? "HIGH ENERGY"
            : s.energy < 0.4
              ? "LOW ENERGY"
              : "BALANCED",
        );
        text(
          "core-state",
          `${s.mode} ${s.paused ? "PAUSED" : s.reducedMotion ? "STATIC" : "ACTIVE"}`,
        );
        text("footer-state", `${s.mode} MODE`);
        get("pause").setAttribute("aria-pressed", String(s.paused));
        get("pause").setAttribute(
          "aria-label",
          s.paused ? "Resume animation" : "Pause animation",
        );
        get("pause").innerHTML = s.paused
          ? "▷ <span>Resume</span>"
          : "Ⅱ <span>Pause</span>";
        for (const key of ["particles", "grid", "motion"] as const)
          get<HTMLInputElement>(key).checked =
            key === "motion" ? s.reducedMotion : s[key];
        root
          .querySelectorAll<HTMLButtonElement>("[data-mode]")
          .forEach((button) =>
            button.setAttribute(
              "aria-pressed",
              String(button.dataset.mode === s.mode),
            ),
          );
      }),
    );
    root
      .querySelectorAll<HTMLButtonElement>("[data-mode]")
      .forEach((button) => {
        const callback = () => {
          state.setMode(button.dataset.mode as Mode);
          announce(`${state.state.mode} mode activated`);
        };
        button.addEventListener("click", callback);
        this.cleanup.push(() => button.removeEventListener("click", callback));
      });
    listen("energy", "input", () =>
      state.update({
        energy: Number(get<HTMLInputElement>("energy").value) / 100,
      }),
    );
    listen("pause", "click", () => {
      state.update({ paused: !state.state.paused });
      announce(state.state.paused ? "Animation paused" : "Animation resumed");
    });
    listen("reset", "click", () => {
      this.pointer?.reset();
      announce("Orientation reset");
    });
    for (const id of ["particles", "grid", "motion"] as const)
      listen(id, "change", () =>
        state.update({
          [id === "motion" ? "reducedMotion" : id]:
            get<HTMLInputElement>(id).checked,
        }),
      );
    const onMotion = (event: MediaQueryListEvent) =>
      state.update({ reducedMotion: event.matches });
    motionQuery.addEventListener("change", onMotion);
    this.cleanup.push(() =>
      motionQuery.removeEventListener("change", onMotion),
    );
    listen("capture", "click", () => {
      void this.scene?.capture().then((blob) => {
        if (!blob) {
          announce("Capture unavailable");
          return;
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `holographic-${state.state.mode.toLowerCase()}.png`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        announce("Scene image saved");
      });
    });
    const dialog = get<HTMLDialogElement>("about-dialog");
    listen("about-open", "click", () => dialog.showModal());
    listen("about-close", "click", () => dialog.close());
    // Keep the single interactive item in this modal focused in WebKit as well.
    listen("about-dialog", "keydown", (event) => {
      const key = event as KeyboardEvent;
      if (key.key === "Tab") {
        key.preventDefault();
        get("about-close").focus();
      }
    });
  }
  dispose() {
    this.pointer?.dispose();
    this.scene?.dispose();
    this.cleanup.forEach((fn) => fn());
  }
}
