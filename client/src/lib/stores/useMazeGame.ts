import { create } from "zustand";
import { levels, Level, Point } from "../levels";
import { getLocalStorage, setLocalStorage } from "../utils";
import { useAudio } from "./useAudio";

type GameState = "menu" | "instructions" | "playing" | "levelComplete" | "gameOver" | "gameComplete";

interface MazeGameState {
  // Game state
  gameState: GameState;
  gamePaused: boolean;
  currentLevel: number;
  lives: number;
  score: number;
  levelScore: number;
  levelTimeBonus: number;
  timeRemaining: number;
  timer: number | null;
  
  // Player data
  playerPosition: Point;
  playerSpeed: number;
  
  // Level data
  levels: Level[];
  collectiblesCount: number;
  collectiblesTotal: number;
  
  // Actions
  initializeGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  showInstructions: () => void;
  returnToMenu: () => void;
  nextLevel: () => void;
  completeGame: () => void;
  gameOver: () => void;
  
  // Player actions
  setPlayerPosition: (position: Point) => void;
  movePlayer: (direction: "forward" | "backward" | "left" | "right") => void;
  collectItem: (index: number) => void;
  hitObstacle: () => void;
  checkWinCondition: () => void;
  
  // Helper functions
  updateTimer: () => void;
}

export const useMazeGame = create<MazeGameState>((set, get) => ({
  // Initial game state
  gameState: "menu",
  gamePaused: false,
  currentLevel: 0,
  lives: 3,
  score: 0,
  levelScore: 0,
  levelTimeBonus: 0,
  timeRemaining: 120,
  timer: null,
  
  // Initial player data
  playerPosition: { x: 2, y: 0.5, z: 2 },
  playerSpeed: 3,
  
  // Level data
  levels: JSON.parse(JSON.stringify(levels)), // Deep clone to avoid mutating the original
  collectiblesCount: 0,
  collectiblesTotal: 0,
  
  // Initialize game
  initializeGame: () => {
    // Reset game state
    set({
      gameState: "menu",
      gamePaused: false,
      currentLevel: 0,
      lives: 3,
      score: 0,
      levelScore: 0,
      levelTimeBonus: 0,
      timeRemaining: levels[0].timeLimit,
      timer: null,
      playerPosition: { x: 2, y: 0.5, z: 2 },
      levels: JSON.parse(JSON.stringify(levels)),
      collectiblesCount: 0,
      collectiblesTotal: levels[0].collectibles.length
    });
  },
  
  // Start the game
  startGame: () => {
    const { updateTimer } = get();
    
    // Start timer
    const timer = window.setInterval(updateTimer, 1000);
    
    set({
      gameState: "playing",
      timer,
      timeRemaining: levels[0].timeLimit,
      collectiblesTotal: levels[0].collectibles.length
    });
  },
  
  // Pause game
  pauseGame: () => {
    const { timer } = get();
    
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }
    
    set({
      gamePaused: true,
      timer: null
    });
  },
  
  // Resume game
  resumeGame: () => {
    const { updateTimer } = get();
    
    // Restart timer
    const timer = window.setInterval(updateTimer, 1000);
    
    set({
      gamePaused: false,
      timer
    });
  },
  
  // Restart game
  restartGame: () => {
    const { updateTimer } = get();
    
    // Clear existing timer
    const { timer } = get();
    if (timer) {
      clearInterval(timer);
    }
    
    // Start new timer
    const newTimer = window.setInterval(updateTimer, 1000);
    
    set({
      gameState: "playing",
      currentLevel: 0,
      lives: 3,
      score: 0,
      levelScore: 0,
      levelTimeBonus: 0,
      timeRemaining: levels[0].timeLimit,
      timer: newTimer,
      playerPosition: { x: 2, y: 0.5, z: 2 },
      levels: JSON.parse(JSON.stringify(levels)),
      collectiblesCount: 0,
      collectiblesTotal: levels[0].collectibles.length
    });
  },
  
  // Show instructions
  showInstructions: () => {
    set({
      gameState: "instructions"
    });
  },
  
  // Return to menu
  returnToMenu: () => {
    const { timer } = get();
    
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }
    
    set({
      gameState: "menu",
      timer: null
    });
  },
  
  // Go to next level
  nextLevel: () => {
    const { currentLevel, score, updateTimer } = get();
    const nextLevelIndex = currentLevel + 1;
    
    // Clear existing timer
    const { timer } = get();
    if (timer) {
      clearInterval(timer);
    }
    
    // Check if there are more levels
    if (nextLevelIndex < levels.length) {
      // Start new timer
      const newTimer = window.setInterval(updateTimer, 1000);
      
      set({
        gameState: "playing",
        currentLevel: nextLevelIndex,
        timeRemaining: levels[nextLevelIndex].timeLimit,
        timer: newTimer,
        playerPosition: { x: 2, y: 0.5, z: 2 },
        collectiblesCount: 0,
        collectiblesTotal: levels[nextLevelIndex].collectibles.length,
        levelScore: 0,
        levelTimeBonus: 0
      });
    } else {
      // Game completed
      set({
        gameState: "gameComplete",
        timer: null
      });
      
      // Check for high score
      const highScore = getLocalStorage("mazeHighScore") || 0;
      if (score > highScore) {
        setLocalStorage("mazeHighScore", score);
      }
    }
  },
  
  // Complete the game
  completeGame: () => {
    const { timer, score } = get();
    
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }
    
    set({
      gameState: "gameComplete",
      timer: null
    });
    
    // Check for high score
    const highScore = getLocalStorage("mazeHighScore") || 0;
    if (score > highScore) {
      setLocalStorage("mazeHighScore", score);
    }
  },
  
  // Game over
  gameOver: () => {
    const { timer } = get();
    
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }
    
    set({
      gameState: "gameOver",
      timer: null
    });
  },
  
  // Set player position
  setPlayerPosition: (position: Point) => {
    set({ playerPosition: position });
  },
  
  // Move player
  movePlayer: (direction: "forward" | "backward" | "left" | "right") => {
    const { playerPosition, playerSpeed, gamePaused } = get();
    
    // Don't move if game is paused
    if (gamePaused) return;
    
    // Calculate new position
    let newX = playerPosition.x;
    let newZ = playerPosition.z;
    
    switch (direction) {
      case "forward":
        newZ -= 0.1 * playerSpeed;
        break;
      case "backward":
        newZ += 0.1 * playerSpeed;
        break;
      case "left":
        newX -= 0.1 * playerSpeed;
        break;
      case "right":
        newX += 0.1 * playerSpeed;
        break;
      default:
        break;
    }
    
    // Update position (collision is handled in the Player component)
    set({
      playerPosition: {
        ...playerPosition,
        x: newX,
        z: newZ
      }
    });
  },
  
  // Collect item
  collectItem: (index: number) => {
    const { currentLevel, levels, collectiblesCount } = get();
    const updatedLevels = [...levels];
    
    // Mark item as collected
    updatedLevels[currentLevel].collectibles[index].collected = true;
    
    // Update collectibles count
    const newCollectiblesCount = collectiblesCount + 1;
    const totalCollectiblesInLevel = updatedLevels[currentLevel].collectibles.length;
    
    // Add score for collected item
    const itemValue = updatedLevels[currentLevel].collectibles[index].value;
    const newScore = get().score + itemValue;
    const newLevelScore = get().levelScore + itemValue;
    
    // Check if all collectibles have been gathered
    const allCollected = newCollectiblesCount === totalCollectiblesInLevel;
    updatedLevels[currentLevel].allCollectiblesGathered = allCollected;
    
    // Play sound
    useAudio.getState().playSuccess();
    
    set({
      levels: updatedLevels,
      collectiblesCount: newCollectiblesCount,
      score: newScore,
      levelScore: newLevelScore
    });
  },
  
  // Hit obstacle
  hitObstacle: () => {
    const { lives, gameOver } = get();
    
    // Reduce lives
    const newLives = lives - 1;
    
    // Check for game over
    if (newLives <= 0) {
      gameOver();
      return;
    }
    
    set({ lives: newLives });
  },
  
  // Check win condition
  checkWinCondition: () => {
    const { currentLevel, levels, timer, timeRemaining } = get();
    const level = levels[currentLevel];
    
    // Check if all collectibles are gathered
    if (level.allCollectiblesGathered) {
      // Clear timer
      if (timer) {
        clearInterval(timer);
      }
      
      // Calculate time bonus
      const timeBonus = Math.floor(timeRemaining * 5);
      const newScore = get().score + timeBonus;
      
      // Show level complete screen
      set({
        gameState: "levelComplete",
        score: newScore,
        levelTimeBonus: timeBonus,
        timer: null
      });
    }
  },
  
  // Update timer
  updateTimer: () => {
    const { timeRemaining, gameOver } = get();
    
    // Reduce time
    const newTimeRemaining = timeRemaining - 1;
    
    // Check for time up
    if (newTimeRemaining <= 0) {
      gameOver();
      return;
    }
    
    set({ timeRemaining: newTimeRemaining });
  }
}));
