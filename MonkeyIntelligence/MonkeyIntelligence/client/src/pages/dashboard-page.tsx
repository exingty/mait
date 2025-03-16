import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import NavSidebar from "@/components/nav-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GameProgress, Lesson } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: progress } = useQuery<GameProgress[]>({
    queryKey: [`/api/progress/${user!.id}`]
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: [`/api/lessons/${user!.id}`],
    enabled: user?.role === "teacher"
  });

  const recentProgress = progress?.slice(-5) || [];
  const averageScore = progress?.reduce((acc, curr) => acc + curr.score, 0) / (progress?.length || 1);

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}!</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageScore?.toFixed(1) || 0}</div>
              <Progress value={averageScore} className="mt-2" />
            </CardContent>
          </Card>

          {user?.role === "teacher" ? (
            <Card>
              <CardHeader>
                <CardTitle>Lessons Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{lessons?.length || 0}</div>
                <p className="text-muted-foreground mt-2">Total AI-assisted lessons</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Games Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{progress?.length || 0}</div>
                <p className="text-muted-foreground mt-2">Total games completed</p>
              </CardContent>
            </Card>
          )}
        </div>

        {recentProgress.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <LineChart
                  width={800}
                  height={300}
                  data={recentProgress}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="completedAt" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
