import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BookOpen, User, Info, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface StudentsSectionProps {
  activeSubMenu: string;
  setActiveSubMenu: (submenu: string) => void;
}

export function StudentsSection({ activeSubMenu, setActiveSubMenu }: StudentsSectionProps) {
  const classes = [
    { id: 1, name: "Beginner A1", students: 12, level: "A1", color: "bg-pink-100" },
    { id: 2, name: "Elementary A2", students: 8, level: "A2", color: "bg-purple-100" },
    { id: 3, name: "Intermediate B1", students: 15, level: "B1", color: "bg-rose-100" },
    { id: 4, name: "Upper Intermediate B2", students: 6, level: "B2", color: "bg-fuchsia-100" },
  ];

  const students = [
    { id: 1, name: "Emma Martin", class: "B1", progress: 85, avatar: "EM" },
    { id: 2, name: "Lucas Dubois", class: "A2", progress: 72, avatar: "LD" },
    { id: 3, name: "Sophie Bernard", class: "B2", progress: 91, avatar: "SB" },
    { id: 4, name: "Thomas Petit", class: "A1", progress: 68, avatar: "TP" },
    { id: 5, name: "Chloé Rousseau", class: "B1", progress: 78, avatar: "CR" },
  ];

  const stats = [
    { label: "Total Students", value: "41", icon: User },
    { label: "Active Classes", value: "4", icon: BookOpen },
    { label: "Avg Progress", value: "79%", icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600">Students Management</h2>
          <p className="text-gray-600">Manage your French class students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-pink-600">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Student Information</CardTitle>
          <CardDescription>View and manage student details</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubMenu} onValueChange={setActiveSubMenu}>
            <TabsList className="bg-pink-100 p-1 rounded-xl">
              <TabsTrigger value="classes" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                <BookOpen className="w-4 h-4 mr-2" />
                Classes
              </TabsTrigger>
              <TabsTrigger value="students-info" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                <User className="w-4 h-4 mr-2" />
                Students Info
              </TabsTrigger>
              <TabsTrigger value="other-info" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                <Info className="w-4 h-4 mr-2" />
                Other Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((classItem) => (
                  <Card key={classItem.id} className={`${classItem.color} border-pink-200`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-pink-700">{classItem.name}</CardTitle>
                        <Badge variant="secondary" className="bg-white text-pink-600">
                          {classItem.level}
                        </Badge>
                      </div>
                      <CardDescription className="text-pink-600">
                        {classItem.students} students enrolled
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
                            style={{ width: `${(classItem.students / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-pink-600">{classItem.students}/20</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students-info" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-pink-200 hover:bg-pink-50">
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
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
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-pink-300 text-pink-600">
                          {student.class}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-pink-100 rounded-full overflow-hidden max-w-24">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-pink-600">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="other-info" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-pink-200 bg-pink-50">
                  <CardHeader>
                    <CardTitle className="text-pink-600">Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-pink-600 mb-2">92%</div>
                      <p className="text-sm text-pink-500">Overall attendance this month</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-pink-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-600">Assignment Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-purple-600 mb-2">87%</div>
                      <p className="text-sm text-purple-500">Homework completion rate</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-pink-200 bg-rose-50">
                  <CardHeader>
                    <CardTitle className="text-rose-600">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">📝 French Quiz - Oct 25</p>
                      <p className="text-sm">🎭 Cultural Day - Oct 30</p>
                      <p className="text-sm">📚 Exam Period - Nov 5-10</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-pink-200 bg-fuchsia-50">
                  <CardHeader>
                    <CardTitle className="text-fuchsia-600">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">✨ 3 new students joined</p>
                      <p className="text-sm">📖 5 assignments submitted</p>
                      <p className="text-sm">⭐ 2 students reached B1</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
