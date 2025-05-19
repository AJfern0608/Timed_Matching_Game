import { useMazeGame } from "../lib/stores/useMazeGame";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle, CardFooter, CardDescription } from "./ui/card";

export default function Instructions() {
  const { returnToMenu } = useMazeGame();

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
      
      <Card className="w-[600px] max-w-[90vw] bg-background/90 backdrop-blur">
        <CardContent className="pt-6">
          <CardTitle className="text-2xl text-center mb-4">How to Play</CardTitle>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Goal</h3>
              <p>Navigate through the maze to find all collectibles and reach the exit gate to progress to the next level.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Controls</h3>
              <ul className="space-y-2">
                <li><span className="font-bold">Movement:</span> WASD or Arrow keys</li>
                <li><span className="font-bold">Jump:</span> Space (useful for some obstacles)</li>
                <li><span className="font-bold">Interact:</span> E key (to pick up items or activate mechanisms)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Gameplay</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>You have 3 lives to complete all 5 levels</li>
                <li>Collect all gems in each maze to unlock the exit gate</li>
                <li>Avoid hazards - hitting them will cost you a life</li>
                <li>Complete levels faster for higher scores</li>
                <li>Each level introduces new challenges and maze complexity</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Tips</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Look for visual cues to help with orientation</li>
                <li>The mini-map in the corner shows your position</li>
                <li>The difficulty increases with each level</li>
                <li>Time management is important for high scores</li>
              </ul>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={returnToMenu} className="w-full">
            Back to Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
