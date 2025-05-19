import { useEffect } from "react";
import { useMazeGame } from "../lib/stores/useMazeGame";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { getLocalStorage, setLocalStorage } from "../lib/utils";
import { useAudio } from "../lib/stores/useAudio";
import Confetti from "react-confetti";

export default function GameComplete() {
  const { score, restartGame, returnToMenu } = useMazeGame();
  const { playSuccess } = useAudio();
  
  const highScore = getLocalStorage("mazeHighScore") || 0;
  const isNewHighScore = score > highScore;
  
  // Save high score if needed
  useEffect(() => {
    if (isNewHighScore) {
      setLocalStorage("mazeHighScore", score);
      playSuccess();
    }
  }, [isNewHighScore, score, playSuccess]);
  
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-purple-900 to-purple-950">
      {isNewHighScore && <Confetti />}
      
      <Card className="w-96 max-w-[90%] bg-background/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            {isNewHighScore ? "New High Score!" : "Game Complete!"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6 text-center">
            <p className="text-lg">Congratulations! You've completed all levels!</p>
            
            <div className="pt-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Final Score</p>
                <p className="text-5xl font-bold">{score}</p>
              </div>
              
              {!isNewHighScore && (
                <div>
                  <p className="text-sm text-muted-foreground">High Score</p>
                  <p className="text-3xl font-semibold">{highScore}</p>
                </div>
              )}
              
              {isNewHighScore && (
                <div className="animate-pulse">
                  <p className="text-xl font-semibold text-yellow-500">New Record!</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={restartGame} className="w-full">Play Again</Button>
          <Button onClick={returnToMenu} variant="outline" className="w-full">Return to Menu</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
