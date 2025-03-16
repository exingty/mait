import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import GamePage from "@/pages/game-page";
import AssistantPage from "@/pages/assistant-page";
import PlannerPage from "@/pages/planner-page";
import LessonsPage from "@/pages/lessons-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/game" component={GamePage} />
      <ProtectedRoute path="/assistant" component={AssistantPage} />
      <ProtectedRoute path="/planner" component={PlannerPage} roles={["teacher"]} />
      <ProtectedRoute path="/lessons" component={LessonsPage} roles={["teacher"]} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;