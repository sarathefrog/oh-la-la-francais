import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar, Clock, Video, Bell, Edit, X, CheckCircle } from "lucide-react";

export function ClassesSchedule() {
  const upcomingClasses = [
    {
      id: 1,
      studentName: "Emma Martin",
      avatar: "EM",
      day: "Monday",
      time: "10:00 AM",
      specificDate: "Oct 21, 2025",
      status: "Scheduled",
      attendanceStatus: "Attending",
      meetLink: "https://meet.google.com/abc-defg-hij",
      reminderSent: true
    },
    {
      id: 2,
      studentName: "Lucas Dubois",
      avatar: "LD",
      day: "Tuesday",
      time: "2:00 PM",
      specificDate: "Oct 22, 2025",
      status: "Scheduled",
      attendanceStatus: "Attending",
      meetLink: "https://meet.google.com/klm-nopq-rst",
      reminderSent: true
    },
    {
      id: 3,
      studentName: "Sophie Bernard",
      avatar: "SB",
      day: "Wednesday",
      time: "4:00 PM",
      specificDate: "Oct 23, 2025",
      status: "Scheduled",
      attendanceStatus: "Not Attending",
      meetLink: "https://meet.google.com/uvw-xyza-bcd",
      reminderSent: false
    },
    {
      id: 4,
      studentName: "Thomas Petit",
      avatar: "TP",
      day: "Thursday",
      time: "11:00 AM",
      specificDate: "Oct 24, 2025",
      status: "Completed",
      attendanceStatus: "Attending",
      meetLink: "https://meet.google.com/efg-hijk-lmn",
      reminderSent: true
    },
    {
      id: 5,
      studentName: "Chloé Rousseau",
      avatar: "CR",
      day: "Friday",
      time: "3:00 PM",
      specificDate: "Oct 25, 2025",
      status: "Cancelled",
      attendanceStatus: "Not Attending",
      meetLink: "https://meet.google.com/opq-rstu-vwx",
      reminderSent: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-200 text-blue-700 hover:bg-blue-200";
      case "Completed":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Cancelled":
        return "bg-red-200 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case "Attending":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Not Attending":
        return "bg-orange-200 text-orange-700 hover:bg-orange-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            📅 Classes Schedule (کلاس‌ها)
          </h2>
          <p className="text-gray-600">Manage and view all scheduled classes ✨</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-blue-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-blue-600">{upcomingClasses.filter(c => c.status === "Scheduled").length}</p>
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
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-green-600">{upcomingClasses.filter(c => c.status === "Completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-red-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-400 rounded-2xl flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-red-600">{upcomingClasses.filter(c => c.status === "Cancelled").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-purple-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-purple-600">{upcomingClasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Upcoming Classes</CardTitle>
          <CardDescription>View and manage scheduled classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-pink-200 hover:bg-pink-50">
                    <TableHead>Student</TableHead>
                    <TableHead>Day & Time</TableHead>
                    <TableHead>Specific Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Reminder</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingClasses.map((classItem) => (
                    <TableRow key={classItem.id} className="border-pink-200 hover:bg-pink-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300 text-white">
                              {classItem.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span>{classItem.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{classItem.day}</p>
                          <p className="text-sm text-gray-500">{classItem.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>{classItem.specificDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(classItem.status)}>
                          {classItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAttendanceColor(classItem.attendanceStatus)}>
                          {classItem.attendanceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {classItem.reminderSent ? (
                          <Badge className="bg-green-200 text-green-700 hover:bg-green-200">
                            ✅ Sent
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-200 text-orange-700 hover:bg-orange-200">
                            ⏳ Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl"
                          >
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl"
                          >
                            <Bell className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <X className="w-4 h-4" />
                          </Button>
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

      <Card className="border-pink-200 bg-gradient-to-br from-pink-100 to-purple-100">
        <CardHeader>
          <CardTitle className="text-pink-600">💡 Class Management Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-pink-700">
            <li>✨ Send reminders 24 hours before each class</li>
            <li>📹 Generate Google Meet links for all scheduled classes</li>
            <li>✅ Mark attendance immediately after class completion</li>
            <li>🔄 Offer makeup classes for cancelled sessions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}