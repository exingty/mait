import NavSidebar from "@/components/nav-sidebar";
import LessonPlanner from "@/components/lesson-planner";

export default function PlannerPage() {
  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">AI Lesson Planner</h1>
        <LessonPlanner />
      </main>
    </div>
  );
}
