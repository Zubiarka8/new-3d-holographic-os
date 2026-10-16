import * as THREE from "three";
import { OrbitalSystem } from "./OrbitalSystem";
import { ParticleSystem } from "./ParticleSystem";
import vertexShader from "../shaders/core.vert.glsl?raw";
import fragmentShader from "../shaders/core.frag.glsl?raw";

export interface SceneState {
  mode: "STANDBY" | "ANALYSIS" | "OVERDRIVE";
  energy: number;
  paused: boolean;
  reducedMotion: boolean;
  particles: boolean;
  grid: boolean;
}

export interface SceneMetrics {
  fps: number;
  drawCalls: number;
  particles: number;
  quality: string;
}

export class SceneManager {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(43, 1, 0.1, 60);
  private readonly assembly = new THREE.Group();
  private readonly core = new THREE.Group();
  private readonly orbitals = new OrbitalSystem();
  private readonly particles = new ParticleSystem();
  private readonly floor = new THREE.Group();
  private readonly coreMaterial: THREE.ShaderMaterial;
  private readonly observer: ResizeObserver;
  private state: SceneState = {
    mode: "ANALYSIS",
    energy: 0.65,
    paused: false,
    reducedMotion: false,
    particles: true,
    grid: true,
  };
  private energy = 0.65;
  private frame = 0;
  private time = 0;
  private previous = 0;
  private sampleTime = 0;
  private sampleFrames = 0;
  private slowSamples = 0;
  private dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  private userX = 0;
  private userY = 0;
  private targetX = 0;
  private targetY = 0;
  private disposed = false;
  private contextLost = false;
  private readonly onMetrics?: (metrics: SceneMetrics) => void;
  private readonly pointerMove = (event: PointerEvent): void => {
    const bounds = this.canvas.getBoundingClientRect();
    this.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.18;
    this.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.12;
  };
  private readonly pointerLeave = (): void => {
    this.targetX = 0;
    this.targetY = 0;
  };
  private readonly lostContext = (event: Event): void => {
    event.preventDefault();
    this.contextLost = true;
    this.canvas.dispatchEvent(
      new CustomEvent("graphics-unavailable", {
        bubbles: true,
        detail: "WebGL context lost",
      }),
    );
  };
  private readonly restoredContext = (): void => {
    this.contextLost = false;
    this.previous = 0;
    this.canvas.dispatchEvent(
      new CustomEvent("graphics-restored", { bubbles: true }),
    );
  };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    onMetrics?: (metrics: SceneMetrics) => void,
  ) {
    this.onMetrics = onMetrics;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(0x080c14, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.fog = new THREE.FogExp2(0x080c14, 0.065);
    this.camera.position.set(0, 0.75, 7.5);
    this.camera.lookAt(0, -0.05, 0);
    this.coreMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: 0.65 },
        uColor: { value: new THREE.Color(0x66e8ff) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    this.core.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.03, 100, 70),
        this.coreMaterial,
      ),
    );

    const innerWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.94, 2),
      new THREE.MeshBasicMaterial({
        color: 0x66e8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.core.add(innerWire);
    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.47, 1),
      new THREE.MeshBasicMaterial({
        color: 0xb18aff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      }),
    );
    inner.rotation.set(0.4, 0.6, 0);
    this.core.add(inner);
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 40, 24),
      new THREE.ShaderMaterial({
        vertexShader:
          "varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",
        fragmentShader:
          "varying vec3 n; varying vec3 v; void main(){float f=pow(1.-abs(dot(normalize(n),normalize(v))),4.);gl_FragColor=vec4(.18,.7,1.,f*.18);}",
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.core.add(glow);
    this.assembly.add(this.core, this.orbitals.group);
    this.assembly.rotation.z = -0.12;
    this.scene.add(this.assembly, this.particles.points);
    this.buildFloor();
    this.scene.add(this.floor);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    canvas.addEventListener("pointermove", this.pointerMove);
    canvas.addEventListener("pointerleave", this.pointerLeave);
    canvas.addEventListener("webglcontextlost", this.lostContext);
    canvas.addEventListener("webglcontextrestored", this.restoredContext);
    this.resize();
    this.renderer.compile(this.scene, this.camera);
    this.frame = requestAnimationFrame(this.animate);
  }

  setState(state: SceneState): void {
    this.state = {
      ...state,
      energy: THREE.MathUtils.clamp(state.energy, 0, 1),
    };
    this.particles.points.visible = state.particles;
    this.floor.visible = state.grid;
  }

  rotate(dx: number, dy: number): void {
    this.userY += dx * 0.005;
    this.userX = THREE.MathUtils.clamp(this.userX + dy * 0.005, -1.2, 1.2);
  }
  resetView(): void {
    this.userX = 0;
    this.userY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.assembly.rotation.x = 0;
    this.assembly.rotation.y = 0;
  }

  capture(): Promise<Blob | null> {
    if (this.disposed || this.contextLost) return Promise.resolve(null);
    // Snapshot in the same task as rendering so the default framebuffer has not
    // been discarded by the compositor. Persistent GPU buffers are unnecessary.
    this.renderer.render(this.scene, this.camera);
    return new Promise((resolve) => this.canvas.toBlob(resolve, "image/png"));
  }

  private buildFloor(): void {
    this.floor.position.y = -1.75;
    const grid = new THREE.GridHelper(16, 32, 0x245264, 0x16313e);
    const materials = Array.isArray(grid.material)
      ? grid.material
      : [grid.material];
    for (const material of materials) {
      material.transparent = true;
      material.opacity = 0.23;
      material.depthWrite = false;
    }
    this.floor.add(grid);
    for (const [index, radius] of [1.3, 1.5, 2.25, 2.3, 3.1].entries()) {
      const points = Array.from({ length: 181 }, (_, i) => {
        const angle = (i / 180) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          0.015,
          Math.sin(angle) * radius,
        );
      });
      this.floor.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: index === 2 ? 0xb18aff : 0x66e8ff,
            transparent: true,
            opacity: index === 2 ? 0.3 : 0.16,
            blending: THREE.AdditiveBlending,
          }),
        ),
      );
    }
  }

  private resize(): void {
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.position.z = this.camera.aspect < 0.8 ? 9.3 : 7.5;
    this.camera.updateProjectionMatrix();
  }

  private readonly animate = (now: number): void => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.animate);
    const delta = this.previous
      ? Math.min((now - this.previous) / 1000, 0.05)
      : 0;
    this.previous = now;
    if (document.hidden || this.contextLost) return;
    const moving = !this.state.paused && !this.state.reducedMotion;
    const speed =
      this.state.mode === "OVERDRIVE"
        ? 1.8
        : this.state.mode === "STANDBY"
          ? 0.35
          : 1;
    if (moving) this.time += delta * speed;
    this.energy =
      !moving || Math.abs(this.energy - this.state.energy) < 0.0001
        ? this.state.energy
        : THREE.MathUtils.damp(this.energy, this.state.energy, 4, delta);
    this.coreMaterial.uniforms["uTime"]!.value = this.time;
    this.coreMaterial.uniforms["uEnergy"]!.value = this.energy;
    const targetColor =
      this.state.mode === "OVERDRIVE"
        ? new THREE.Color(0xb18aff)
        : new THREE.Color(0x66e8ff);
    const color = this.coreMaterial.uniforms["uColor"]!.value as THREE.Color;
    const colorDistance =
      Math.abs(color.r - targetColor.r) +
      Math.abs(color.g - targetColor.g) +
      Math.abs(color.b - targetColor.b);
    if (!moving || colorDistance < 0.0001) color.copy(targetColor);
    else color.lerp(targetColor, Math.min(1, delta * 3));
    this.core.rotation.set(
      this.userX + this.time * 0.035,
      this.userY + this.time * 0.09,
      0,
    );
    this.core.scale.setScalar(
      1.1 * (1 + Math.sin(this.time * 1.2) * 0.018 * this.energy),
    );
    this.orbitals.update(this.time, this.energy);
    this.particles.update(this.time, this.energy, this.dpr);
    if (moving) {
      this.assembly.rotation.y =
        Math.abs(this.assembly.rotation.y - this.targetX) < 0.0001
          ? this.targetX
          : THREE.MathUtils.damp(
              this.assembly.rotation.y,
              this.targetX,
              3,
              delta,
            );
      this.assembly.rotation.x =
        Math.abs(this.assembly.rotation.x - this.targetY) < 0.0001
          ? this.targetY
          : THREE.MathUtils.damp(
              this.assembly.rotation.x,
              this.targetY,
              3,
              delta,
            );
    }
    this.renderer.render(this.scene, this.camera);
    this.sampleFrames++;
    if (now - this.sampleTime >= 1000) {
      const fps = this.sampleTime
        ? (this.sampleFrames * 1000) / (now - this.sampleTime)
        : 0;
      if (moving && fps > 0 && fps < 38) this.slowSamples++;
      else this.slowSamples = 0;
      if (this.slowSamples >= 3 && this.dpr > 1) {
        this.dpr = Math.max(1, this.dpr - 0.25);
        this.renderer.setPixelRatio(this.dpr);
        this.resize();
        this.slowSamples = 0;
      }
      this.onMetrics?.({
        fps: Math.round(fps),
        drawCalls: this.renderer.info.render.calls,
        particles: this.state.particles ? this.particles.count : 0,
        quality: this.dpr > 1.25 ? "HIGH" : "ADAPTIVE",
      });
      this.sampleTime = now;
      this.sampleFrames = 0;
    }
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.canvas.removeEventListener("pointermove", this.pointerMove);
    this.canvas.removeEventListener("pointerleave", this.pointerLeave);
    this.canvas.removeEventListener("webglcontextlost", this.lostContext);
    this.canvas.removeEventListener(
      "webglcontextrestored",
      this.restoredContext,
    );
    this.scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.Line ||
        object instanceof THREE.Points
      ) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material: THREE.Material) => material.dispose());
      }
    });
    this.renderer.dispose();
  }
}
