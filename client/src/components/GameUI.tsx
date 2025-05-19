import { useEffect, useState } from "react";
import { useMazeGame } from "../lib/stores/useMazeGame";
import { useAudio } from "../lib/stores/useAudio";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function GameUI() {
  const { 
    lives, 
    score, 
    currentLevel, 
    timeRemaining, 
    collectiblesCount, 
    collectiblesTotal,
    pauseGame,
    resumeGame,
    returnToMenu,
    gamePaused
  } = useMazeGame();
  
  const { toggleMute, isMuted } = useAudio();
  
  const [showControls, setShowControls] = useState(true);
  
  // Auto-hide controls after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <>
      {/* Top Game Stats */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <Card className="bg-background/80 backdrop-blur-sm p-3 shadow-lg">
          <div className="flex space-x-6 items-center">
            <div>
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="text-xl font-bold">{currentLevel + 1}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Lives</p>
              <p className="flex">
                {Array(lives).fill(0).map((_, i) => (
                  <span key={i} className="text-red-500 text-xl">❤️</span>
                ))}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-xl font-bold">{score}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-xl font-bold">{formatTime(timeRemaining)}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Collectibles</p>
              <p className="text-xl font-bold">{collectiblesCount} / {collectiblesTotal}</p>
            </div>
          </div>
        </Card>
        
        <div className="flex space-x-2">
          <Button onClick={toggleMute} variant="ghost" className="bg-background/80 backdrop-blur-sm">
            {isMuted ? (
              <span className="text-lg"><i className="fas fa-volume-mute"></i></span>
            ) : (
              <span className="text-lg"><i className="fas fa-volume-up"></i></span>
            )}
          </Button>
          
          <Button onClick={pauseGame} variant="ghost" className="bg-background/80 backdrop-blur-sm">
            <span className="text-lg"><i className="fas fa-pause"></i></span>
          </Button>
        </div>
      </div>
      
      {/* Controls Hint */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
          <p className="text-sm text-center">
            Move: WASD or Arrow Keys | Collect all gems to unlock the exit!
          </p>
        </div>
      )}
      
      {/* Pause Menu */}
      {gamePaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Card className="w-96 bg-background/95 backdrop-blur-md">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-center">Game Paused</h2>
              
              <div className="space-y-2">
                <Button onClick={resumeGame} className="w-full">Resume Game</Button>
                <Button onClick={returnToMenu} variant="outline" className="w-full">Return to Menu</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
