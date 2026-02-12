// Player movement – extends existing behavior
export function initMovement(keysRef) {
  window.addEventListener('keydown', e => keysRef.current[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', e => keysRef.current[e.key.toLowerCase()] = false);
}

export function updateMovement(playerRef, cameraRef, keysRef) {
  const speed = 0.2;
  const player = playerRef.current;
  const camera = cameraRef.current;

  if (!player) return;

  if (keysRef.current['w']) player.position.z -= speed;
  if (keysRef.current['s']) player.position.z += speed;
  if (keysRef.current['a']) player.position.x -= speed;
  if (keysRef.current['d']) player.position.x += speed;

  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 25;
  camera.lookAt(player.position);
}
