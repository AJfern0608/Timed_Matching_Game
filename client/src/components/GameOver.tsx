import { useMazeGame } from "../lib/stores/useMazeGame";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function GameOver() {
  const { score, currentLevel, restartGame, returnToMenu } = useMazeGame();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-red-900 to-red-950">
      <Card className="w-96 max-w-[90%] bg-background/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Game Over</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 text-center">
            <p>You've run out of lives!</p>
            
            <div className="pt-4 space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Final Score</p>
                <p className="text-4xl font-bold">{score}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Level Reached</p>
                <p className="text-2xl">{currentLevel + 1}</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={restartGame} className="w-full">Try Again</Button>
          <Button onClick={returnToMenu} variant="outline" className="w-full">Return to Menu</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
