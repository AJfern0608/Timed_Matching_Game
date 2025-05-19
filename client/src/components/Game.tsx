import { useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "../lib/stores/useAudio";
import { useMazeGame } from "../lib/stores/useMazeGame";
import Menu from "./Menu";
import Instructions from "./Instructions";
import ThreeDScene from "./ThreeDScene";
import GameUI from "./GameUI";
import GameOver from "./GameOver";
import LevelComplete from "./LevelComplete";
import GameComplete from "./GameComplete";

// Define keyboard controls for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "action", keys: ["KeyE"] },
];

function Game() {
  const { gameState, initializeGame } = useMazeGame();
  const { backgroundMusic, toggleMute, isMuted } = useAudio();

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle background music
  useEffect(() => {
    if (backgroundMusic && gameState === "playing" && !isMuted) {
      backgroundMusic.play().catch(err => console.log("Audio error:", err));
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [backgroundMusic, gameState, isMuted]);

  return (
    <KeyboardControls map={controls}>
      <div className="w-screen h-screen">
        {gameState === "menu" && <Menu />}
        {gameState === "instructions" && <Instructions />}
        {gameState === "playing" && (
          <>
            <ThreeDScene />
            <GameUI />
          </>
        )}
        {gameState === "levelComplete" && <LevelComplete />}
        {gameState === "gameOver" && <GameOver />}
        {gameState === "gameComplete" && <GameComplete />}
      </div>
    </KeyboardControls>
  );
}

export default Game;
