import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import { 
  BookOpen, 
  GamepadIcon, 
  LayoutDashboard, 
  LogOut, 
  MessageSquareText,
  User,
  CalendarIcon
} from "lucide-react";

export default function NavSidebar() {
  const { user, logoutMutation } = useAuth();

  const navItems = user?.role === "teacher" ? [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "Lesson Planner", href: "/planner" },
    { icon: CalendarIcon, label: "My Lessons", href: "/lessons" },
    { icon: MessageSquareText, label: "AI Assistant", href: "/assistant" },
  ] : [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: GamepadIcon, label: "Math Games", href: "/game" },
    { icon: MessageSquareText, label: "AI Assistant", href: "/assistant" },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sidebar-foreground">MonkeyAI</h1>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-8 w-8 text-sidebar-foreground" />
          <div>
            <p className="font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-sm text-sidebar-foreground/60 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button 
          variant="secondary" 
          className="w-full gap-2"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}