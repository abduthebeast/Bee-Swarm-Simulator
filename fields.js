// Colored pollen fields
import * as THREE from 'three';

export function createFields(scene) {
  const configs = [
    { color: 0xff0000, multiplier: 2 },
    { color: 0x0000ff, multiplier: 2 },
    { color: 0xffffff, multiplier: 1.5 }
  ];

  return configs.map((cfg, i) => {
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(6, 32),
      new THREE.MeshBasicMaterial({ color: cfg.color, opacity: 0.4, transparent: true })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(i * 15 - 15, 0.01, -10);
    scene.add(mesh);

    return { mesh, multiplier: cfg.multiplier };
  });
}
