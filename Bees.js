// Bee logic – abilities, following, pollen collection
import * as THREE from 'three';

export function createBeeMesh(beeData) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.25),
    new THREE.MeshLambertMaterial({ color: beeData.rarity.color })
  );

  return {
    mesh,
    data: {
      ...beeData,
      cooldown: 0
    }
  };
}

export function updateBees({ beesRef, playerRef, fieldsRef, setPollen }) {
  beesRef.current.forEach((bee, i) => {
    const offset = new THREE.Vector3(
      Math.cos(Date.now() * 0.002 + i) * 2,
      1.5,
      Math.sin(Date.now() * 0.002 + i) * 2
    );

    bee.mesh.position.lerp(playerRef.current.position.clone().add(offset), 0.05);

    const field = fieldsRef.current.find(f => f.mesh.position.distanceTo(bee.mesh.position) < 2);
    if (field) {
      setPollen(p => p + bee.data.rarity.power * field.multiplier);
    }

    if (bee.data.cooldown > 0) bee.data.cooldown--;
  });
}
