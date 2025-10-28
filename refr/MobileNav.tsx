import { Home, Calendar, Menu, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface MobileNavProps {
  onMenuClick: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function MobileNav({ onMenuClick, activeSection, setActiveSection }: MobileNavProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-purple-300 rounded-xl flex items-center justify-center shadow-md">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-pink-600 text-sm">French Class Bot</h1>
            <p className="text-xs text-pink-400 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Admin Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("dashboard")}
            className={`h-10 px-3 rounded-xl ${
              activeSection === "dashboard"
                ? "bg-gradient-to-r from-pink-200 to-purple-200 text-pink-700"
                : "text-gray-600"
            }`}
          >
            <Home className="w-4 h-4 mr-1" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("classes")}
            className={`h-10 px-3 rounded-xl ${
              activeSection === "classes"
                ? "bg-gradient-to-r from-pink-200 to-purple-200 text-pink-700"
                : "text-gray-600"
            }`}
          >
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-xs">Classes</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-10 w-10 rounded-xl hover:bg-pink-100"
          >
            <Menu className="w-5 h-5 text-pink-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
