import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckCircle, XCircle, Eye, Edit, Calendar, DollarSign, Star, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function StudentsManagement() {
  const students = [
    {
      id: 1,
      name: "Emma Martin",
      telegramId: "@emmamartin",
      phone: "+33 6 12 34 56 78",
      email: "emma@example.com",
      city: "Paris",
      birthDate: "1995-03-15",
      registrationDate: "2025-01-10",
      level: "Intermediate",
      classType: "Group",
      sessionsLeft: 8,
      sessionsPerWeek: 2,
      selectedDays: "Mon, Wed",
      selectedTimes: "10:00 AM",
      paymentStatus: "Paid",
      registrationStatus: "Approved",
      avatar: "EM"
    },
    {
      id: 2,
      name: "Lucas Dubois",
      telegramId: "@lucasd",
      phone: "+33 6 23 45 67 89",
      email: "lucas@example.com",
      city: "Lyon",
      birthDate: "1998-07-22",
      registrationDate: "2025-10-15",
      level: "Beginner",
      classType: "Private",
      sessionsLeft: 0,
      sessionsPerWeek: 1,
      selectedDays: "Tue, Thu",
      selectedTimes: "2:00 PM",
      paymentStatus: "Overdue",
      registrationStatus: "Approved",
      avatar: "LD"
    },
    {
      id: 3,
      name: "Sophie Bernard",
      telegramId: "@sophieb",
      phone: "+33 6 34 56 78 90",
      email: "",
      city: "Marseille",
      birthDate: "1992-11-08",
      registrationDate: "2025-10-18",
      level: "Advanced",
      classType: "Group",
      sessionsLeft: 12,
      sessionsPerWeek: 3,
      selectedDays: "Mon, Wed, Fri",
      selectedTimes: "4:00 PM",
      paymentStatus: "Paid",
      registrationStatus: "Pending",
      avatar: "SB"
    },
    {
      id: 4,
      name: "Thomas Petit",
      telegramId: "@thomasp",
      phone: "+33 6 45 67 89 01",
      email: "thomas@example.com",
      city: "Nice",
      birthDate: "2000-05-30",
      registrationDate: "2025-10-17",
      level: "Beginner",
      classType: "Private",
      sessionsLeft: 5,
      sessionsPerWeek: 2,
      selectedDays: "Sat, Sun",
      selectedTimes: "11:00 AM",
      paymentStatus: "Unpaid",
      registrationStatus: "Existing Pending",
      avatar: "TP"
    }
  ];

  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Pending":
        return "bg-orange-200 text-orange-700 hover:bg-orange-200";
      case "Existing Pending":
        return "bg-purple-200 text-purple-700 hover:bg-purple-200";
      case "Rejected":
        return "bg-red-200 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Unpaid":
        return "bg-yellow-200 text-yellow-700 hover:bg-yellow-200";
      case "Overdue":
        return "bg-red-200 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            👥 Students Management (دانش‌آموزان)
          </h2>
          <p className="text-gray-600">Manage student information and registrations ✨</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-green-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-green-600">{students.filter(s => s.registrationStatus === "Approved").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-orange-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-orange-600">{students.filter(s => s.registrationStatus === "Pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-purple-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">🔄</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Existing Pending</p>
                <p className="text-purple-600">{students.filter(s => s.registrationStatus === "Existing Pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-pink-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-pink-600">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Student Information</CardTitle>
          <CardDescription>View and manage all student details</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="bg-pink-100 p-1 rounded-xl mb-6">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                All Students
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                Approved
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                Pending
              </TabsTrigger>
              <TabsTrigger value="existing-pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                Existing Pending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="overflow-x-auto -mx-6 px-6">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-pink-200 hover:bg-pink-50">
                        <TableHead>Student</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Class Type</TableHead>
                        <TableHead>Sessions Left</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id} className="border-pink-200 hover:bg-pink-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300 text-white">
                                  {student.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p>{student.name}</p>
                                <p className="text-xs text-gray-500">{student.telegramId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{student.phone}</p>
                              <p className="text-gray-500">{student.city}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-pink-300 text-pink-600">
                              {student.level}
                            </Badge>
                          </TableCell>
                          <TableCell>{student.classType}</TableCell>
                          <TableCell>
                            <Badge className={student.sessionsLeft === 0 ? "bg-red-200 text-red-700" : "bg-blue-200 text-blue-700"}>
                              {student.sessionsLeft} left
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPaymentColor(student.paymentStatus)}>
                              {student.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(student.registrationStatus)}>
                              {student.registrationStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-pink-300 text-pink-600 hover:bg-pink-50 rounded-xl"
                                    onClick={() => setSelectedStudent(student)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-pink-600">Student Details</DialogTitle>
                                    <DialogDescription>Complete information for {student.name}</DialogDescription>
                                  </DialogHeader>
                                  {selectedStudent && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500">Name</p>
                                          <p>{selectedStudent.name}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Telegram ID</p>
                                          <p>{selectedStudent.telegramId}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Phone</p>
                                          <p>{selectedStudent.phone}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Email</p>
                                          <p>{selectedStudent.email || "N/A"}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">City</p>
                                          <p>{selectedStudent.city}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Birth Date</p>
                                          <p>{selectedStudent.birthDate}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Registration Date</p>
                                          <p>{selectedStudent.registrationDate}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Level</p>
                                          <Badge variant="outline" className="border-pink-300 text-pink-600">
                                            {selectedStudent.level}
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Class Type</p>
                                          <p>{selectedStudent.classType}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Sessions Left</p>
                                          <p>{selectedStudent.sessionsLeft}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Sessions Per Week</p>
                                          <p>{selectedStudent.sessionsPerWeek}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Selected Days</p>
                                          <p>{selectedStudent.selectedDays}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Selected Times</p>
                                          <p>{selectedStudent.selectedTimes}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Payment Status</p>
                                          <Badge className={getPaymentColor(selectedStudent.paymentStatus)}>
                                            {selectedStudent.paymentStatus}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 pt-4">
                                        <Button className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl">
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Approve
                                        </Button>
                                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl">
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Reject
                                        </Button>
                                        <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl">
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Schedule
                                        </Button>
                                        <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl">
                                          <Calendar className="w-4 h-4 mr-2" />
                                          View Classes
                                        </Button>
                                        <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl">
                                          <DollarSign className="w-4 h-4 mr-2" />
                                          Payment Reminder
                                        </Button>
                                        <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50 rounded-xl">
                                          <Star className="w-4 h-4 mr-2" />
                                          Send Survey
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="text-center py-8 text-gray-500">
                Showing only approved students...
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="text-center py-8 text-gray-500">
                Showing only pending students...
              </div>
            </TabsContent>

            <TabsContent value="existing-pending">
              <div className="text-center py-8 text-gray-500">
                Showing only existing pending students...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}