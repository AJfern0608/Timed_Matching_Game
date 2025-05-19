import { useMazeGame } from "../lib/stores/useMazeGame";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function LevelComplete() {
  const { currentLevel, score, levelTimeBonus, levelScore, nextLevel } = useMazeGame();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-green-900 to-green-950">
      <Card className="w-96 max-w-[90%] bg-background/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Level {currentLevel + 1} Complete!</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 text-center">
            <p>Great job! You've completed the level.</p>
            
            <div className="pt-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Level Score</p>
                <p className="text-3xl font-bold">{levelScore}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Time Bonus</p>
                <p className="text-2xl font-semibold text-green-600">+{levelTimeBonus}</p>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-4xl font-bold">{score}</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={nextLevel} className="w-full">Continue to Level {currentLevel + 2}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
