import * as THREE from "three";

const cyan = 0x66e8ff;

export class OrbitalSystem {
  readonly group = new THREE.Group();
  private readonly moving: THREE.Group[] = [];

  constructor() {
    const configurations = [
      { radius: 1.62, tilt: 0.34, turn: 0.15, color: cyan },
      { radius: 1.92, tilt: 1.06, turn: -0.65, color: 0xb18aff },
      { radius: 2.16, tilt: 0.68, turn: 0.9, color: cyan },
    ];
    for (const [index, config] of configurations.entries()) {
      const orbit = new THREE.Group();
      orbit.rotation.set(config.tilt, config.turn, index * 0.7);
      const points = Array.from({ length: 257 }, (_, i) => {
        const angle = (i / 256) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * config.radius,
          0,
          Math.sin(angle) * config.radius,
        );
      });
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      orbit.add(line);
      const arc = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
          points.slice(0, 40 + index * 12),
        ),
        new THREE.LineBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      orbit.add(arc);
      const marker = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.042),
        new THREE.MeshBasicMaterial({ color: 0xe6f7ff }),
      );
      marker.position.set(config.radius, 0, 0);
      orbit.add(marker);
      const ticks: THREE.Vector3[] = [];
      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const length = i % 5 === 0 ? 0.055 : 0.022;
        ticks.push(
          new THREE.Vector3(
            Math.cos(angle) * config.radius,
            0,
            Math.sin(angle) * config.radius,
          ),
          new THREE.Vector3(
            Math.cos(angle) * (config.radius + length),
            0,
            Math.sin(angle) * (config.radius + length),
          ),
        );
      }
      orbit.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(ticks),
          new THREE.LineBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.4,
          }),
        ),
      );
      this.group.add(orbit);
      this.moving.push(orbit);
    }
  }

  update(time: number, energy: number): void {
    this.moving.forEach((orbit, index) => {
      orbit.rotation.y =
        time * (0.035 + index * 0.017) * (1 + energy) + index * 0.7;
      orbit.rotation.z = index * 0.7 + Math.sin(time * 0.12 + index) * 0.12;
    });
  }
}
