import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BarChart3, TrendingUp, Users, Calendar, Download, BookOpen } from "lucide-react";

export function AnalyticsReports() {
  const performanceMetrics = [
    { label: "Student Retention Rate", value: "92%", trend: "+5%", icon: Users, color: "from-pink-400 to-rose-400" },
    { label: "Class Completion Rate", value: "88%", trend: "+3%", icon: Calendar, color: "from-blue-400 to-cyan-400" },
    { label: "Avg. Student Progress", value: "76%", trend: "+8%", icon: TrendingUp, color: "from-green-400 to-emerald-400" },
    { label: "Homework Submission", value: "85%", trend: "+2%", icon: BookOpen, color: "from-purple-400 to-pink-400" }
  ];

  const monthlyData = [
    { month: "Jun", students: 42, revenue: 8400, completion: 85 },
    { month: "Jul", students: 48, revenue: 9600, completion: 87 },
    { month: "Aug", students: 55, revenue: 11000, completion: 86 },
    { month: "Sep", students: 62, revenue: 12400, completion: 88 },
    { month: "Oct", students: 68, revenue: 13600, completion: 90 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            📊 Analytics & Reports (گزارش‌ها)
          </h2>
          <p className="text-gray-600">Track performance and generate reports ✨</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Download Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-pink-600">{metric.value}</p>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        {metric.trend}
                      </Badge>
                    </div>
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
              <BarChart3 className="w-5 h-5" />
              Student Registration Trends
            </CardTitle>
            <CardDescription>Monthly growth over the past 5 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month} 2025</span>
                    <Badge variant="outline" className="border-pink-300 text-pink-600">
                      {data.students} students
                    </Badge>
                  </div>
                  <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                      style={{ width: `${(data.students / 70) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-600 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Growth
            </CardTitle>
            <CardDescription>Monthly revenue over the past 5 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month} 2025</span>
                    <Badge variant="outline" className="border-purple-300 text-purple-600">
                      €{data.revenue}
                    </Badge>
                  </div>
                  <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      style={{ width: `${(data.revenue / 14000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Class Completion Rates</CardTitle>
          <CardDescription>Track how students are progressing through their courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {monthlyData.map((data, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-2">{data.month}</p>
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="#f3e8ff"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(data.completion / 100) * 201} 201`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-pink-600">{data.completion}%</span>
                  </div>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-pink-200 bg-gradient-to-br from-pink-100 to-rose-100">
          <CardHeader>
            <CardTitle className="text-pink-600">📈 Top Performing Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-pink-600 mb-2">Intermediate B1</p>
              <p className="text-sm text-pink-700">95% completion rate</p>
              <p className="text-sm text-gray-600 mt-2">15 students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-purple-100 to-pink-100">
          <CardHeader>
            <CardTitle className="text-purple-600">⭐ Student Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-purple-600 mb-2">4.8 / 5.0</p>
              <p className="text-sm text-purple-700">Average rating</p>
              <p className="text-sm text-gray-600 mt-2">Based on 42 reviews</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-blue-100 to-cyan-100">
          <CardHeader>
            <CardTitle className="text-blue-600">🎯 Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-blue-600 mb-2">2.3 hours</p>
              <p className="text-sm text-blue-700">Avg. question response</p>
              <p className="text-sm text-gray-600 mt-2">Improved by 15%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-purple-600">💡 Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-purple-700">
            <li className="flex items-start gap-2">
              <span className="text-lg">📊</span>
              <span>Student enrollment increased by 62% over the past 5 months - consider adding more class slots</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">⭐</span>
              <span>B1 level classes have the highest completion rate - market this as a strength</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">💬</span>
              <span>Response time has improved significantly - maintain this excellent support level</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">💰</span>
              <span>Revenue growth is steady at 12% monthly - on track to meet yearly goals</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
