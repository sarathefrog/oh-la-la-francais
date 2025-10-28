import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, CheckCircle, Clock, UserPlus, GraduationCap, Calendar, HelpCircle, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function DashboardOverview() {
  const stats = [
    { label: "Total Students", value: "156", icon: Users, color: "from-pink-400 to-rose-400", bgColor: "bg-pink-50" },
    { label: "Approved Students", value: "142", icon: CheckCircle, color: "from-green-400 to-emerald-400", bgColor: "bg-green-50" },
    { label: "Pending Students", value: "8", icon: Clock, color: "from-orange-400 to-yellow-400", bgColor: "bg-orange-50" },
    { label: "Existing Pending", value: "6", icon: UserPlus, color: "from-purple-400 to-pink-400", bgColor: "bg-purple-50" },
    { label: "Test Class Requests", value: "12", icon: GraduationCap, color: "from-blue-400 to-indigo-400", bgColor: "bg-blue-50" },
    { label: "Upcoming Classes", value: "24", icon: Calendar, color: "from-teal-400 to-cyan-400", bgColor: "bg-teal-50" },
    { label: "Unanswered Questions", value: "5", icon: HelpCircle, color: "from-rose-400 to-red-400", bgColor: "bg-rose-50" },
    { label: "Homework Submissions", value: "18", icon: BookOpen, color: "from-violet-400 to-purple-400", bgColor: "bg-violet-50" },
  ];

  const upcomingClasses = [
    { id: 1, student: "Emma Martin", time: "10:00 AM", date: "Oct 19", level: "B1", avatar: "EM" },
    { id: 2, student: "Lucas Dubois", time: "2:00 PM", date: "Oct 19", level: "A2", avatar: "LD" },
    { id: 3, student: "Sophie Bernard", time: "4:00 PM", date: "Oct 20", level: "B2", avatar: "SB" },
    { id: 4, student: "Thomas Petit", time: "11:00 AM", date: "Oct 21", level: "A1", avatar: "TP" },
    { id: 5, student: "Chloé Rousseau", time: "3:00 PM", date: "Oct 22", level: "B1", avatar: "CR" },
  ];

  const recentQuestions = [
    { id: 1, student: "Marie Laurent", question: "How to conjugate 'être' in passé composé?", time: "2h ago" },
    { id: 2, student: "Pierre Leroy", question: "What's the difference between 'savoir' and 'connaître'?", time: "5h ago" },
    { id: 3, student: "Julie Moreau", question: "When should I use subjunctive mood?", time: "1d ago" },
  ];

  const recentHomework = [
    { id: 1, student: "Antoine Simon", title: "Chapter 5 Exercises", submitted: "1h ago", status: "pending" },
    { id: 2, student: "Camille Girard", title: "Essay: Mon Vacances", submitted: "3h ago", status: "pending" },
    { id: 3, student: "Alexandre Durand", title: "Vocabulary Quiz", submitted: "5h ago", status: "reviewed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            🏠 Dashboard Overview
          </h2>
          <p className="text-gray-600">Welcome back! Here's what's happening today ✨</p>
        </div>
        <Badge className="bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 px-4 py-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} border-pink-200 shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-pink-600">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-pink-600 flex items-center gap-2">
              📅 Upcoming Classes (Next 7 Days)
            </CardTitle>
            <CardDescription>Classes scheduled for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300 text-white">
                        {classItem.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-800">{classItem.student}</p>
                      <p className="text-sm text-gray-500">{classItem.date} at {classItem.time}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-pink-300 text-pink-600">
                    {classItem.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-600 flex items-center gap-2">
              ❓ Recent Questions (Unanswered)
            </CardTitle>
            <CardDescription>Student questions awaiting response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentQuestions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-purple-600">{question.student}</p>
                    <span className="text-xs text-gray-500">{question.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{question.question}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-600 flex items-center gap-2">
            📝 Recent Homework Submissions
          </CardTitle>
          <CardDescription>Latest assignments submitted by students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentHomework.map((hw) => (
              <div
                key={hw.id}
                className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    className={
                      hw.status === "pending"
                        ? "bg-orange-200 text-orange-700 hover:bg-orange-200"
                        : "bg-green-200 text-green-700 hover:bg-green-200"
                    }
                  >
                    {hw.status === "pending" ? "⏳ Pending" : "✅ Reviewed"}
                  </Badge>
                  <span className="text-xs text-gray-500">{hw.submitted}</span>
                </div>
                <p className="text-rose-600 mb-1">{hw.student}</p>
                <p className="text-sm text-gray-700">{hw.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-pink-200 bg-gradient-to-br from-pink-100 to-purple-100">
          <CardHeader>
            <CardTitle className="text-pink-600">💡 Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-pink-700">
              <li>✨ Review pending student registrations in the Students tab</li>
              <li>💬 Answer recent questions to keep engagement high</li>
              <li>📅 Check upcoming classes and send reminders</li>
              <li>📝 Review homework submissions before the weekend</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-purple-100 to-rose-100">
          <CardHeader>
            <CardTitle className="text-purple-600">🎯 Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Approve 8 pending student registrations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Answer 5 unanswered questions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Review 18 homework submissions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Schedule 12 test classes
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
