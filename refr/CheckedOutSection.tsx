import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, TrendingDown, Users, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function CheckedOutSection() {
  const checkedOutStudents = [
    { id: 1, name: "Alexandre Durand", lastClass: "B1", checkoutDate: "2025-10-15", avatar: "AD", reason: "Completed course" },
    { id: 2, name: "Isabelle Blanc", lastClass: "A2", checkoutDate: "2025-10-12", avatar: "IB", reason: "Personal reasons" },
    { id: 3, name: "Nicolas Garnier", lastClass: "B2", checkoutDate: "2025-10-10", avatar: "NG", reason: "Relocation" },
    { id: 4, name: "Amélie Fontaine", lastClass: "A1", checkoutDate: "2025-10-08", avatar: "AF", reason: "Schedule conflict" },
    { id: 5, name: "Julien Mercier", lastClass: "B1", checkoutDate: "2025-10-05", avatar: "JM", reason: "Completed course" },
    { id: 6, name: "Céline Dupont", lastClass: "A2", checkoutDate: "2025-10-03", avatar: "CD", reason: "Financial reasons" },
  ];

  const reasonCounts = {
    "Completed course": 2,
    "Personal reasons": 1,
    "Relocation": 1,
    "Schedule conflict": 1,
    "Financial reasons": 1,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-rose-600">Checked Out Students</h2>
          <p className="text-gray-600">Students who have left the program</p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40 border-rose-200 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-rose-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-200 to-pink-200 rounded-2xl flex items-center justify-center">
                <LogOut className="w-7 h-7 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Checked Out</p>
                <p className="text-rose-600">{checkedOutStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-200 to-rose-200 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-orange-600">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-rose-200 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-purple-600">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-rose-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-rose-600">Checkout History</CardTitle>
          <CardDescription>View students who have left the program</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-rose-200 hover:bg-rose-50">
                <TableHead>Student</TableHead>
                <TableHead>Last Class</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkedOutStudents.map((student) => (
                <TableRow key={student.id} className="border-rose-200 hover:bg-rose-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-rose-300 to-pink-300 text-white">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-rose-300 text-rose-600">
                      {student.lastClass}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">{student.checkoutDate}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                      {student.reason}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-rose-600">
              <Users className="w-5 h-5 inline mr-2" />
              Checkout Reasons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(reasonCounts).map(([reason, count]) => (
                <div key={reason} className="flex items-center justify-between">
                  <span className="text-sm text-rose-600">{reason}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-400 to-pink-400"
                        style={{ width: `${(count / checkedOutStudents.length) * 100}%` }}
                      />
                    </div>
                    <Badge variant="outline" className="border-rose-300 text-rose-600">
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-gradient-to-br from-purple-50 to-rose-50">
          <CardHeader>
            <CardTitle className="text-purple-600">💭 Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl">
                <p className="text-sm text-purple-600">
                  ✨ <span>33% of students completed their course successfully</span>
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl">
                <p className="text-sm text-purple-600">
                  📊 <span>Most checkouts occur in B1 level</span>
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl">
                <p className="text-sm text-purple-600">
                  💡 <span>Consider offering flexible scheduling options</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
