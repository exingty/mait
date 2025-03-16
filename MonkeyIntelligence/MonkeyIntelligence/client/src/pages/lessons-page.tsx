import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import NavSidebar from "@/components/nav-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lesson } from "@shared/schema";
import { format } from "date-fns";

export default function LessonsPage() {
  const { user } = useAuth();
  
  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: [`/api/lessons/${user!.id}`],
    enabled: user?.role === "teacher"
  });

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">My Lessons</h1>
        
        <div className="grid gap-6">
          {lessons?.map((lesson) => (
            <Card key={lesson.id}>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Created on {format(new Date(lesson.createdAt), "PPP")}
                </p>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm">
                  {lesson.content}
                </pre>
              </CardContent>
            </Card>
          ))}

          {!lessons?.length && (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  No lessons created yet. Use the Lesson Planner to create your first lesson!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
