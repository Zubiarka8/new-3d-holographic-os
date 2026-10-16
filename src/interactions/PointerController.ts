export class PointerController {
  private clearOrientation: () => void;
  private cleanup: () => void;
  constructor(
    canvas: HTMLCanvasElement,
    rotate: (dx: number, dy: number) => void,
    reset: () => void,
    report: (x: number, y: number, input: string) => void,
  ) {
    let down = false;
    let lastX = 0;
    let lastY = 0;
    let x = 0;
    let y = 0;
    const moveBy = (dx: number, dy: number, input: string) => {
      x += dx;
      y += dy;
      rotate(dx, dy);
      report(x, y, input);
    };
    this.clearOrientation = () => {
      x = 0;
      y = 0;
      reset();
      report(0, 0, "POINTER");
    };
    const start = (event: PointerEvent) => {
      down = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.focus({ preventScroll: true });
    };
    const move = (event: PointerEvent) => {
      if (!down) return;
      moveBy(
        event.clientX - lastX,
        event.clientY - lastY,
        event.pointerType.toUpperCase(),
      );
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const end = () => {
      down = false;
    };
    const key = (event: KeyboardEvent) => {
      const vectors: Record<string, [number, number]> = {
        ArrowLeft: [-15, 0],
        ArrowRight: [15, 0],
        ArrowUp: [0, -15],
        ArrowDown: [0, 15],
      };
      const vector = vectors[event.key];
      if (vector) {
        event.preventDefault();
        moveBy(...vector, "KEYBOARD");
      }
      if (event.key === "Home") {
        event.preventDefault();
        reset();
        x = 0;
        y = 0;
        report(x, y, "KEYBOARD");
      }
    };
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("lostpointercapture", end);
    canvas.addEventListener("keydown", key);
    this.cleanup = () => {
      canvas.removeEventListener("pointerdown", start);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", end);
      canvas.removeEventListener("pointercancel", end);
      canvas.removeEventListener("lostpointercapture", end);
      canvas.removeEventListener("keydown", key);
    };
  }
  reset() {
    this.clearOrientation();
  }
  dispose() {
    this.cleanup();
  }
}
