import * as THREE from "three";
import vertexShader from "../shaders/particles.vert.glsl?raw";
import fragmentShader from "../shaders/particles.frag.glsl?raw";

export class ParticleSystem {
  readonly points: THREE.Points;
  readonly count = 1500;
  private readonly material: THREE.ShaderMaterial;

  constructor() {
    const positions = new Float32Array(this.count * 3);
    const phases = new Float32Array(this.count);
    let seed = 907;
    const random = (): number => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < this.count; i++) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(random() * 2 - 1);
      const radius = 1.7 + random() * 3.7;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius * 0.65;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      phases[i] = random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: 0.65 },
        uPixelRatio: { value: 1 },
        uColor: { value: new THREE.Color(0x66e8ff) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.points = new THREE.Points(geometry, this.material);
  }

  update(time: number, energy: number, pixelRatio: number): void {
    this.material.uniforms["uTime"]!.value = time;
    this.material.uniforms["uEnergy"]!.value = energy;
    this.material.uniforms["uPixelRatio"]!.value = pixelRatio;
    this.points.rotation.y = time * 0.012;
  }
}
