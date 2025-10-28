import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { GraduationCap, CheckCircle, Clock, Video, Calendar } from "lucide-react";

export function TestClasses() {
  const testClassRequests = [
    {
      id: 1,
      studentName: "Alexandre Durand",
      contact: "+33 6 90 12 34 56",
      avatar: "AD",
      preferredTime: "Weekdays 2-5 PM",
      learningReason: "Want to travel to France next year",
      experienceLevel: "Absolute Beginner",
      requestDate: "Oct 19, 2025",
      status: "Pending"
    },
    {
      id: 2,
      studentName: "Isabelle Blanc",
      contact: "+33 6 01 23 45 67",
      avatar: "IB",
      preferredTime: "Weekends Morning",
      learningReason: "Career advancement",
      experienceLevel: "Beginner (A1)",
      requestDate: "Oct 18, 2025",
      status: "Approved"
    },
    {
      id: 3,
      studentName: "Nicolas Garnier",
      contact: "+33 6 12 34 56 78",
      avatar: "NG",
      preferredTime: "Evenings 6-8 PM",
      learningReason: "Moving to France for work",
      experienceLevel: "Intermediate (B1)",
      requestDate: "Oct 18, 2025",
      status: "Completed"
    },
    {
      id: 4,
      studentName: "Amélie Fontaine",
      contact: "+33 6 23 45 67 89",
      avatar: "AF",
      preferredTime: "Flexible",
      learningReason: "Personal interest and culture",
      experienceLevel: "Beginner (A2)",
      requestDate: "Oct 17, 2025",
      status: "Approved"
    },
    {
      id: 5,
      studentName: "Julien Mercier",
      contact: "+33 6 34 56 78 90",
      avatar: "JM",
      preferredTime: "Weekdays Afternoon",
      learningReason: "University requirements",
      experienceLevel: "Absolute Beginner",
      requestDate: "Oct 16, 2025",
      status: "Pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-200 text-orange-700 hover:bg-orange-200";
      case "Approved":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Completed":
        return "bg-blue-200 text-blue-700 hover:bg-blue-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  const pendingCount = testClassRequests.filter(t => t.status === "Pending").length;
  const approvedCount = testClassRequests.filter(t => t.status === "Approved").length;
  const completedCount = testClassRequests.filter(t => t.status === "Completed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            🆓 Test Classes (کلاس‌های آزمایشی)
          </h2>
          <p className="text-gray-600">Manage trial class requests ✨</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-orange-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-orange-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-green-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-green-600">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-blue-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-blue-600">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-purple-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-purple-600">68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Trial Class Requests</CardTitle>
          <CardDescription>Review and schedule test classes for potential students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-pink-200 hover:bg-pink-50">
                    <TableHead>Student</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Preferred Time</TableHead>
                    <TableHead>Experience Level</TableHead>
                    <TableHead>Learning Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testClassRequests.map((request) => (
                    <TableRow key={request.id} className="border-pink-200 hover:bg-pink-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300 text-white">
                              {request.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span>{request.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{request.contact}</span>
                      </TableCell>
                      <TableCell>{request.preferredTime}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-purple-300 text-purple-600">
                          {request.experienceLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{request.learningReason}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl"
                              >
                                <Calendar className="w-4 h-4 mr-1" />
                                Schedule
                              </Button>
                            </>
                          )}
                          {request.status === "Approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl"
                            >
                              <Video className="w-4 h-4 mr-1" />
                              Send Link
                            </Button>
                          )}
                          {request.status === "Completed" && (
                            <Badge className="bg-green-200 text-green-700 hover:bg-green-200">
                              ✅ Done
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-pink-200 bg-gradient-to-br from-pink-100 to-rose-100">
          <CardHeader>
            <CardTitle className="text-pink-600">🎯 Trial Class Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-pink-700">
              <li>✨ Respond to trial requests within 24 hours</li>
              <li>📅 Offer flexible scheduling options</li>
              <li>💬 Send a welcome message before the class</li>
              <li>🎁 Share learning materials after the trial</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-purple-100 to-pink-100">
          <CardHeader>
            <CardTitle className="text-purple-600">📊 Trial Class Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl">
                <p className="text-sm text-purple-600">
                  🌟 Most requested time: <span>Weekday Evenings</span>
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl">
                <p className="text-sm text-purple-600">
                  📈 Top learning reason: <span>Travel preparation</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}