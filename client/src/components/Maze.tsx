import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { useMazeGame } from "../lib/stores/useMazeGame";
import CollectibleItem from "./CollectibleItem";

interface MazeProps {
  level: number;
}

export default function Maze({ level }: MazeProps) {
  const { levels } = useMazeGame();
  const currentLevelData = levels[level];
  
  // Load textures
  const floorTexture = useTexture("/textures/grass.png");
  const wallTexture = useTexture("/textures/wood.jpg");
  const exitTexture = useTexture("/textures/asphalt.png");
  
  // Repeat textures
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(0.5, 0.5);
  
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(1, 1);
  
  // Generate maze geometry
  const { floorGeometry, walls, exitPosition } = useMemo(() => {
    // Calculate maze dimensions
    const layout = currentLevelData.layout;
    const cellSize = 2;
    const mazeWidth = layout[0].length * cellSize;
    const mazeHeight = layout.length * cellSize;
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(mazeWidth, mazeHeight);
    
    // Create walls
    const walls: { position: [number, number, number], scale: [number, number, number] }[] = [];
    
    for (let z = 0; z < layout.length; z++) {
      for (let x = 0; x < layout[z].length; x++) {
        if (layout[z][x] === 1) {
          const wallX = x * cellSize + cellSize / 2 - currentLevelData.offset.x;
          const wallZ = z * cellSize + cellSize / 2 - currentLevelData.offset.z;
          
          walls.push({
            position: [wallX, 1, wallZ],
            scale: [cellSize, 2, cellSize]
          });
        }
      }
    }
    
    // Calculate exit position
    const exitPosition = [
      currentLevelData.exit.position.x,
      0.05,
      currentLevelData.exit.position.z
    ] as [number, number, number];
    
    return { floorGeometry, walls, exitPosition };
  }, [currentLevelData]);
  
  return (
    <group>
      {/* Floor */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        {floorGeometry}
        <meshStandardMaterial map={floorTexture} />
      </mesh>
      
      {/* Walls */}
      {walls.map((wall, index) => (
        <mesh
          key={`wall-${index}`}
          position={wall.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={wall.scale} />
          <meshStandardMaterial map={wallTexture} />
        </mesh>
      ))}
      
      {/* Exit */}
      <mesh
        position={exitPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial 
          map={exitTexture} 
          color={currentLevelData.allCollectiblesGathered ? "#4CAF50" : "#F44336"} 
          emissive={currentLevelData.allCollectiblesGathered ? "#4CAF50" : "#F44336"}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Collectibles */}
      {currentLevelData.collectibles.map((collectible, index) => (
        !collectible.collected && (
          <CollectibleItem 
            key={`collectible-${index}`}
            position={[collectible.position.x, 0.5, collectible.position.z]}
          />
        )
      ))}
      
      {/* Obstacles */}
      {currentLevelData.obstacles.map((obstacle, index) => (
        <mesh
          key={`obstacle-${index}`}
          position={[obstacle.position.x, 0.5, obstacle.position.z]}
          castShadow
        >
          <cylinderGeometry args={[obstacle.radius, obstacle.radius, 1, 16]} />
          <meshStandardMaterial color="#FF5722" />
        </mesh>
      ))}
    </group>
  );
}
