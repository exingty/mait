import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { insertProgressSchema } from "@shared/schema";

interface MathGameProps {
  difficulty: "easy" | "medium" | "hard";
  onGameOver: () => void;
}

interface Question {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
}

function generateQuestion(difficulty: string): Question {
  const operators = {
    easy: ["+", "-"],
    medium: ["*", "/"],
    hard: ["+", "-", "*", "/"]
  };

  const ranges = {
    easy: { min: 1, max: 20 },
    medium: { min: 1, max: 12 },
    hard: { min: 1, max: 100 }
  };

  const range = ranges[difficulty as keyof typeof ranges];
  const operator = operators[difficulty as keyof typeof operators][
    Math.floor(Math.random() * operators[difficulty as keyof typeof operators].length)
  ];

  let num1 = Math.floor(Math.random() * (range.max - range.min)) + range.min;
  let num2 = Math.floor(Math.random() * (range.max - range.min)) + range.min;

  // Ensure division results in whole numbers
  if (operator === "/") {
    num1 = num1 * num2;
  }

  let answer;
  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "*":
      answer = num1 * num2;
      break;
    case "/":
      answer = num1 / num2;
      break;
    default:
      answer = 0;
  }

  return { num1, num2, operator, answer };
}

export default function MathGame({ difficulty, onGameOver }: MathGameProps) {
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question>(generateQuestion(difficulty));
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [timeLeft, setTimeLeft] = useState(60);

  const saveMutation = useMutation({
    mutationFn: async (score: number) => {
      return await apiRequest("POST", "/api/progress", {
        userId: user!.id,
        gameType: `math_${difficulty}`,
        score,
        completedAt: new Date()
      });
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = () => {
    const isCorrect = Number(answer) === question.answer;
    if (isCorrect) setScore(score + 1);
    
    setQuestionsLeft(questionsLeft - 1);
    if (questionsLeft <= 1) {
      handleGameOver();
    } else {
      setQuestion(generateQuestion(difficulty));
      setAnswer("");
    }
  };

  const handleGameOver = () => {
    saveMutation.mutate(score, {
      onSuccess: () => {
        onGameOver();
      }
    });
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">Score: {score}</div>
          <div className="text-lg font-medium">Time: {timeLeft}s</div>
        </div>

        <Progress value={(questionsLeft / 10) * 100} />

        <div className="text-center space-y-4">
          <div className="text-4xl font-bold">
            {question.num1} {question.operator} {question.num2} = ?
          </div>
          
          <div className="flex gap-4">
            <Input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnswer()}
              placeholder="Enter your answer"
              className="text-center text-xl"
            />
            
            <Button onClick={handleAnswer}>
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
