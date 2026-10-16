export type Mode = "STANDBY" | "ANALYSIS" | "OVERDRIVE";
export interface AppState {
  mode: Mode;
  energy: number;
  paused: boolean;
  reducedMotion: boolean;
  particles: boolean;
  grid: boolean;
}
export class StateMachine {
  readonly state: AppState;
  private listeners = new Set<(state: AppState) => void>();
  constructor(reducedMotion = false) {
    this.state = {
      mode: "ANALYSIS",
      energy: 0.65,
      paused: false,
      reducedMotion,
      particles: true,
      grid: true,
    };
  }
  update(patch: Partial<AppState>) {
    Object.assign(this.state, patch);
    this.state.energy = Math.min(1, Math.max(0, this.state.energy));
    this.listeners.forEach((listener) => listener(this.state));
  }
  setMode(mode: Mode) {
    this.update({
      mode,
      energy: { STANDBY: 0.25, ANALYSIS: 0.65, OVERDRIVE: 1 }[mode],
    });
  }
  subscribe(listener: (state: AppState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }
}
