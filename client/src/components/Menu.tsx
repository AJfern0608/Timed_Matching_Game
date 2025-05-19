import { useEffect } from "react";
import { useMazeGame } from "../lib/stores/useMazeGame";
import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle, CardFooter, CardDescription } from "./ui/card";
import { getLocalStorage } from "../lib/utils";

export default function Menu() {
  const { startGame, showInstructions } = useMazeGame();
  const { toggleMute, isMuted } = useAudio();
  const highScore = getLocalStorage("mazeHighScore") || 0;

  // Ensure keyboard controls don't affect the background
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="text-white text-7xl font-bold mb-6 text-center">
        MAZE EXPLORER
      </div>
      
      <Card className="w-96 bg-background/90 backdrop-blur">
        <CardContent className="pt-6">
          <CardTitle className="text-2xl text-center mb-4">Navigate 3D Mazes</CardTitle>
          <CardDescription className="text-center mb-6">
            Find collectibles, avoid obstacles, and reach the exit in increasingly challenging mazes!
          </CardDescription>
          
          {highScore > 0 && (
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">High Score</p>
              <p className="text-2xl font-bold">{highScore}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={startGame} 
            className="w-full text-lg py-6"
            size="lg"
          >
            Start Game
          </Button>
          
          <Button 
            onClick={showInstructions} 
            variant="outline" 
            className="w-full"
          >
            How to Play
          </Button>
          
          <Button 
            onClick={toggleMute}
            variant="ghost"
            className="w-full"
          >
            {isMuted ? (
              <>
                <i className="fas fa-volume-mute mr-2"></i> Unmute Sound
              </>
            ) : (
              <>
                <i className="fas fa-volume-up mr-2"></i> Mute Sound
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
