import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { DashboardOverview } from "./components/DashboardOverview";
import { StudentsManagement } from "./components/StudentsManagement";
import { ClassesSchedule } from "./components/ClassesSchedule";
import { CancelledClasses } from "./components/CancelledClasses";
import { QuestionsSupport } from "./components/QuestionsSupport";
import { HomeworkAssignments } from "./components/HomeworkAssignments";
import { TestClasses } from "./components/TestClasses";
import { PaymentsFinance } from "./components/PaymentsFinance";
import { AnalyticsReports } from "./components/AnalyticsReports";
import { NotificationsCommunications } from "./components/NotificationsCommunications";
import { SettingsConfiguration } from "./components/SettingsConfiguration";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "students":
        return <StudentsManagement />;
      case "classes":
        return <ClassesSchedule />;
      case "cancelled":
        return <CancelledClasses />;
      case "questions":
        return <QuestionsSupport />;
      case "homework":
        return <HomeworkAssignments />;
      case "test-classes":
        return <TestClasses />;
      case "payments":
        return <PaymentsFinance />;
      case "analytics":
        return <AnalyticsReports />;
      case "notifications":
        return <NotificationsCommunications />;
      case "settings":
        return <SettingsConfiguration />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <MobileNav 
        onMenuClick={() => setIsMobileMenuOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden w-full max-w-full">
        <div className="max-w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}