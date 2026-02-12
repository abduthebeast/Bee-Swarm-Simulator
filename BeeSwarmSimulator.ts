// Main component – ALL original logic preserved
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { initMovement, updateMovement } from './movement';
import { createBeeMesh, updateBees } from './bees';
import { createFields } from './fields';
import { hatchEgg, loadSave, saveGame } from './systems';

export default function BeeSwarmSimulator() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const playerRef = useRef(null);
  const beesRef = useRef([]);
  const fieldsRef = useRef([]);
  const keysRef = useRef({});

  const [pollen, setPollen] = useState(0);
  const [honey, setHoney] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState([]);
  const [slots, setSlots] = useState(3);

  useEffect(() => {
    loadSave(setPollen, setHoney, setInventory, setEquipped, setSlots);
  }, []);

  useEffect(() => {
    saveGame({ pollen, honey, inventory, equipped, slots });
  }, [pollen, honey, inventory, equipped, slots]);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(20, 40, 20);
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshLambertMaterial({ color: 0x4caf50 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const player = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    player.position.y = 1;
    playerRef.current = player;
    scene.add(player);

    fieldsRef.current = createFields(scene);

    equipped.forEach(b => {
      const bee = createBeeMesh(b);
      beesRef.current.push(bee);
      scene.add(bee.mesh);
    });

    initMovement(keysRef);

    function animate() {
      requestAnimationFrame(animate);

      updateMovement(playerRef, cameraRef, keysRef);

      updateBees({
        beesRef,
        playerRef,
        fieldsRef,
        setPollen
      });

      if (pollen >= 10) {
        setPollen(p => p - 10);
        setHoney(h => h + 1);
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => renderer.dispose();
  }, [equipped]);

  return (
    <>
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />

      <div className="ui">
        <div>🌼 Pollen: {pollen}</div>
        <div>🍯 Honey: {honey}</div>
        <button onClick={() => hatchEgg(honey, setHoney, inventory, setInventory)}>🥚 Hatch Egg</button>
        <div>🐝 Slots: {equipped.length}/{slots}</div>
        <button onClick={() => honey >= 50 && setSlots(s => s + 1) && setHoney(h => h - 50)}>
          Upgrade Hive (50🍯)
        </button>
      </div>
    </>
  );
}
