import { useState } from "react";
import NavSidebar from "@/components/nav-sidebar";
import MathGame from "@/components/math-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GameDifficulty = "easy" | "medium" | "hard";

export default function GamePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<GameDifficulty>("easy");

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Math Games</h1>

        {!isPlaying ? (
          <div className="grid md:grid-cols-3 gap-6">
            {(["easy", "medium", "hard"] as GameDifficulty[]).map((level) => (
              <Card key={level}>
                <CardHeader>
                  <CardTitle className="capitalize">{level} Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {level === "easy" && "Basic addition and subtraction"}
                    {level === "medium" && "Multiplication and division"}
                    {level === "hard" && "Mixed operations with larger numbers"}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setDifficulty(level);
                      setIsPlaying(true);
                    }}
                  >
                    Start Game
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Button 
              variant="outline" 
              onClick={() => setIsPlaying(false)}
              className="mb-4"
            >
              Back to Selection
            </Button>
            <MathGame 
              difficulty={difficulty} 
              onGameOver={() => setIsPlaying(false)} 
            />
          </div>
        )}
      </main>
    </div>
  );
}
