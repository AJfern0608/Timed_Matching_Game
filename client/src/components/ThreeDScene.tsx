import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect } from "react";
import { useMazeGame } from "../lib/stores/useMazeGame";

// Lazy load components to improve initial load time
const Player = lazy(() => import("./Player"));
const Maze = lazy(() => import("./Maze"));

export default function ThreeDScene() {
  const { currentLevel, playerPosition } = useMazeGame();

  // Ensure focus is on the canvas for keyboard controls
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.focus();
    }
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{
          position: [playerPosition.x, 10, playerPosition.z + 5],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "default"
        }}
        tabIndex={0} // Make canvas focusable for keyboard controls
      >
        {/* Ambient light for general illumination */}
        <ambientLight intensity={0.4} />
        
        {/* Main directional light - creates shadows */}
        <directionalLight 
          position={[20, 30, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        
        {/* Game elements */}
        <Suspense fallback={null}>
          {/* Sky */}
          <color attach="background" args={["#87CEEB"]} />
          
          {/* Maze and all level elements */}
          <Maze level={currentLevel} />
          
          {/* Player character */}
          <Player />
        </Suspense>
      </Canvas>
    </div>
  );
}
