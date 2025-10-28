import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Clock, Check, X, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function PendingSection() {
  const pendingStudents = [
    { id: 1, name: "Marie Laurent", requestedClass: "A2", date: "2025-10-18", avatar: "ML", reason: "New student" },
    { id: 2, name: "Pierre Leroy", requestedClass: "B1", date: "2025-10-18", avatar: "PL", reason: "Level upgrade" },
    { id: 3, name: "Julie Moreau", requestedClass: "A1", date: "2025-10-17", avatar: "JM", reason: "New student" },
    { id: 4, name: "Antoine Simon", requestedClass: "B2", date: "2025-10-17", avatar: "AS", reason: "Transfer" },
    { id: 5, name: "Camille Girard", requestedClass: "A2", date: "2025-10-16", avatar: "CG", reason: "New student" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-purple-600">Pending Verifications</h2>
          <p className="text-gray-600">Review and approve student requests</p>
        </div>
        <Badge className="bg-purple-200 text-purple-700 hover:bg-purple-200">
          <Clock className="w-3 h-3 mr-1" />
          {pendingStudents.length} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Today</p>
                <p className="text-purple-600">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl flex items-center justify-center">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved This Week</p>
                <p className="text-green-600">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Awaiting Info</p>
                <p className="text-orange-600">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-600">Student Verification Queue</CardTitle>
          <CardDescription>Review student applications and requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-200 hover:bg-purple-50">
                <TableHead>Student</TableHead>
                <TableHead>Requested Class</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingStudents.map((student) => (
                <TableRow key={student.id} className="border-purple-200 hover:bg-purple-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-purple-300 to-pink-300 text-white">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-purple-300 text-purple-600">
                      {student.requestedClass}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{student.reason}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">{student.date}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-purple-600">💡 Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-purple-600">
            <li>✨ Check student previous records before approving level changes</li>
            <li>💬 Contact students if additional information is needed</li>
            <li>📝 Document the reason for rejection to help students improve</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
