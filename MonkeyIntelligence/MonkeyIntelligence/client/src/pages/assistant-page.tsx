import NavSidebar from "@/components/nav-sidebar";
import AIAssistant from "@/components/ai-assistant";

export default function AssistantPage() {
  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">AI Study Assistant</h1>
        <AIAssistant />
      </main>
    </div>
  );
}
