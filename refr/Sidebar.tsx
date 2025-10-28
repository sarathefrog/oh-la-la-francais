import { Home, Users, Calendar, X, HelpCircle, BookOpen, GraduationCap, DollarSign, BarChart3, Bell, Settings, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ activeSection, setActiveSection, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "bg-pink-200", emoji: "🏠" },
    { id: "students", label: "Students", icon: Users, color: "bg-purple-200", emoji: "👥" },
    { id: "classes", label: "Classes", icon: Calendar, color: "bg-blue-200", emoji: "📅" },
    { id: "cancelled", label: "Cancelled", icon: X, color: "bg-red-200", emoji: "❌" },
    { id: "questions", label: "Questions", icon: HelpCircle, color: "bg-orange-200", emoji: "❓" },
    { id: "homework", label: "Homework", icon: BookOpen, color: "bg-rose-200", emoji: "📝" },
    { id: "test-classes", label: "Test Classes", icon: GraduationCap, color: "bg-green-200", emoji: "🆓" },
    { id: "payments", label: "Payments", icon: DollarSign, color: "bg-emerald-200", emoji: "💰" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "bg-cyan-200", emoji: "📊" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "bg-yellow-200", emoji: "🔔" },
    { id: "settings", label: "Settings", icon: Settings, color: "bg-slate-200", emoji: "⚙️" },
  ];

  const handleMenuItemClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-pink-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-purple-300 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-pink-600">French Class Bot</h1>
            <p className="text-sm text-pink-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Admin Dashboard
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-pink-200 to-purple-200 text-pink-700 shadow-md scale-105"
                    : "hover:bg-pink-50 text-gray-600 hover:scale-102"
                }`}
              >
                <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center ${
                  isActive ? "shadow-md" : ""
                }`}>
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <span className="text-sm">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-pink-200">
        <div className="p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl">
          <p className="text-sm text-pink-600 text-center">
            ✨ Made with love for French learners 💕
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 bg-white/80 backdrop-blur-sm border-r border-pink-200 shadow-xl flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-white/95 backdrop-blur-md">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access all dashboard sections</SheetDescription>
          </VisuallyHidden>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}