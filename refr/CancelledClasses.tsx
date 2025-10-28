import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar, RefreshCw } from "lucide-react";

export function CancelledClasses() {
  const cancelledClasses = [
    {
      id: 1,
      studentName: "Chloé Rousseau",
      contact: "+33 6 56 78 90 12",
      avatar: "CR",
      originalDateTime: "Oct 25, 2025 - 3:00 PM",
      cancellationDate: "Oct 19, 2025",
      reason: "Student illness",
      makeupStatus: "Scheduled"
    },
    {
      id: 2,
      studentName: "Pierre Leroy",
      contact: "+33 6 67 89 01 23",
      avatar: "PL",
      originalDateTime: "Oct 20, 2025 - 1:00 PM",
      cancellationDate: "Oct 18, 2025",
      reason: "Personal emergency",
      makeupStatus: "Pending"
    },
    {
      id: 3,
      studentName: "Marie Laurent",
      contact: "+33 6 78 90 12 34",
      avatar: "ML",
      originalDateTime: "Oct 18, 2025 - 10:00 AM",
      cancellationDate: "Oct 17, 2025",
      reason: "Schedule conflict",
      makeupStatus: "Completed"
    },
    {
      id: 4,
      studentName: "Antoine Simon",
      contact: "+33 6 89 01 23 45",
      avatar: "AS",
      originalDateTime: "Oct 15, 2025 - 4:00 PM",
      cancellationDate: "Oct 14, 2025",
      reason: "Travel",
      makeupStatus: "Not Requested"
    }
  ];

  const getMakeupStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Pending":
        return "bg-orange-200 text-orange-700 hover:bg-orange-200";
      case "Completed":
        return "bg-blue-200 text-blue-700 hover:bg-blue-200";
      case "Not Requested":
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            ❌ Cancelled Classes (کلاس‌های کنسل شده)
          </h2>
          <p className="text-gray-600">Track and reschedule cancelled classes ✨</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-red-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">❌</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cancelled</p>
                <p className="text-red-600">{cancelledClasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-green-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rescheduled</p>
                <p className="text-green-600">{cancelledClasses.filter(c => c.makeupStatus === "Scheduled").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-orange-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Makeup</p>
                <p className="text-orange-600">{cancelledClasses.filter(c => c.makeupStatus === "Pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-blue-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-blue-600">{cancelledClasses.filter(c => c.makeupStatus === "Completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Cancelled Class Information</CardTitle>
          <CardDescription>View and manage cancelled classes and makeup sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-pink-200 hover:bg-pink-50">
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Original Date/Time</TableHead>
                  <TableHead>Cancellation Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Makeup Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cancelledClasses.map((classItem) => (
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
                      <span className="text-sm text-gray-600">{classItem.contact}</span>
                    </TableCell>
                    <TableCell>{classItem.originalDateTime}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{classItem.cancellationDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{classItem.reason}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMakeupStatusColor(classItem.makeupStatus)}>
                        {classItem.makeupStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-200 bg-gradient-to-br from-rose-100 to-pink-100">
        <CardHeader>
          <CardTitle className="text-rose-600">📊 Cancellation Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl">
              <p className="text-sm mb-2 text-gray-600">Top Cancellation Reason</p>
              <p className="text-rose-600">Personal Emergency (35%)</p>
            </div>
            <div className="p-4 bg-white rounded-2xl">
              <p className="text-sm mb-2 text-gray-600">Average Makeup Rate</p>
              <p className="text-green-600">75% Rescheduled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}