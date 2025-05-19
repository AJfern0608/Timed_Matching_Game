import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useMazeGame } from "../lib/stores/useMazeGame";
import { useAudio } from "../lib/stores/useAudio";

export default function Player() {
  const { 
    playerPosition, 
    setPlayerPosition, 
    movePlayer, 
    playerSpeed,
    currentLevel, 
    levels,
    collectItem,
    checkWinCondition,
    hitObstacle
  } = useMazeGame();
  
  const { playHit } = useAudio();
  
  // References
  const playerRef = useRef<THREE.Mesh>(null);
  const smoothedCameraPosition = useRef(new THREE.Vector3(playerPosition.x, 5, playerPosition.z + 5));
  const smoothedCameraTarget = useRef(new THREE.Vector3(playerPosition.x, 0, playerPosition.z));
  
  // Get camera from three.js
  const { camera } = useThree();
  
  // Get keyboard controls
  const [subscribeControls, getControls] = useKeyboardControls();
  
  // Set up collision detection
  useEffect(() => {
    // Subscribe to keyboard controls
    const unsubscribeForward = subscribeControls(
      (state) => state.forward,
      (pressed) => pressed && movePlayer("forward")
    );
    
    const unsubscribeBackward = subscribeControls(
      (state) => state.backward,
      (pressed) => pressed && movePlayer("backward")
    );
    
    const unsubscribeLeftward = subscribeControls(
      (state) => state.leftward,
      (pressed) => pressed && movePlayer("left")
    );
    
    const unsubscribeRightward = subscribeControls(
      (state) => state.rightward,
      (pressed) => pressed && movePlayer("right")
    );
    
    return () => {
      unsubscribeForward();
      unsubscribeBackward();
      unsubscribeLeftward();
      unsubscribeRightward();
    };
  }, [subscribeControls, movePlayer]);
  
  // Update and collision detection loop
  useFrame((_, delta) => {
    if (!playerRef.current) return;
    
    // Get current controls
    const controls = getControls();
    
    // Movement vectors
    const moveVector = new THREE.Vector3(0, 0, 0);
    
    if (controls.forward) moveVector.z -= 1;
    if (controls.backward) moveVector.z += 1;
    if (controls.leftward) moveVector.x -= 1;
    if (controls.rightward) moveVector.x += 1;
    
    // Normalize movement vector if moving in more than one direction
    if (moveVector.length() > 0) {
      moveVector.normalize();
    }
    
    // Apply speed
    moveVector.multiplyScalar(playerSpeed * delta);
    
    // Calculate new position
    const newX = playerPosition.x + moveVector.x;
    const newZ = playerPosition.z + moveVector.z;
    
    // Get maze data for current level
    const level = levels[currentLevel];
    
    // Check wall collisions
    const cellSize = 2;
    const playerRadius = 0.4;
    
    // Check if new position is within a wall
    const gridX = Math.floor((newX + level.offset.x) / cellSize);
    const gridZ = Math.floor((newZ + level.offset.z) / cellSize);
    
    let canMove = true;
    
    // Check if grid position is out of bounds or a wall
    if (
      gridX < 0 || 
      gridX >= level.layout[0].length || 
      gridZ < 0 || 
      gridZ >= level.layout.length || 
      level.layout[gridZ][gridX] === 1
    ) {
      canMove = false;
    }
    
    // Check collision with collectibles
    level.collectibles.forEach((collectible, index) => {
      if (collectible.collected) return;
      
      const collectiblePos = new THREE.Vector3(
        collectible.position.x, 
        0, 
        collectible.position.z
      );
      
      const playerPos = new THREE.Vector3(newX, 0, newZ);
      
      // Use distance check for collection
      if (playerPos.distanceTo(collectiblePos) < 1) {
        collectItem(index);
      }
    });
    
    // Check collision with obstacles
    level.obstacles.forEach(obstacle => {
      const obstaclePos = new THREE.Vector3(
        obstacle.position.x, 
        0, 
        obstacle.position.z
      );
      
      const playerPos = new THREE.Vector3(newX, 0, newZ);
      
      // Check if player is too close to obstacle
      if (playerPos.distanceTo(obstaclePos) < obstacle.radius + playerRadius) {
        canMove = false;
        hitObstacle();
        playHit();
      }
    });
    
    // Check if player reached the exit
    const exitPos = new THREE.Vector3(
      level.exit.position.x, 
      0, 
      level.exit.position.z
    );
    
    const playerPos = new THREE.Vector3(newX, 0, newZ);
    
    if (playerPos.distanceTo(exitPos) < 1) {
      checkWinCondition();
    }
    
    // Update player position if move is valid
    if (canMove) {
      setPlayerPosition({ x: newX, y: playerPosition.y, z: newZ });
      
      // Update player mesh position
      playerRef.current.position.x = newX;
      playerRef.current.position.z = newZ;
    }
    
    // Update camera position with smoothing
    // Camera position (slightly above and behind player)
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerRef.current.position);
    cameraPosition.y += 5;
    cameraPosition.z += 7;
    
    // Camera focus point (ahead of player)
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerRef.current.position);
    cameraTarget.y += 0.5;
    
    // Smoothly interpolate camera position
    smoothedCameraPosition.current.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.current.lerp(cameraTarget, 5 * delta);
    
    // Set camera position and look target
    camera.position.copy(smoothedCameraPosition.current);
    camera.lookAt(smoothedCameraTarget.current);
  });
  
  return (
    <mesh 
      ref={playerRef} 
      position={[playerPosition.x, 0.5, playerPosition.z]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#4285F4" />
    </mesh>
  );
}
