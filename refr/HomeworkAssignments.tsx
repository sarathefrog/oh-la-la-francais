import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";
import { BookOpen, CheckCircle, XCircle, Edit, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function HomeworkAssignments() {
  const [selectedHomework, setSelectedHomework] = useState<typeof homeworkSubmissions[0] | null>(null);
  const [feedback, setFeedback] = useState("");

  const homeworkSubmissions = [
    {
      id: 1,
      studentName: "Emma Martin",
      avatar: "EM",
      assignmentTitle: "Chapter 5 Exercises",
      description: "Completed all grammar exercises from Chapter 5 including conjugation practice and sentence construction.",
      submissionDate: "Oct 19, 2025 - 3:30 PM",
      reviewStatus: "Submitted",
      teacherNotes: "",
      reviewDate: "",
      grade: ""
    },
    {
      id: 2,
      studentName: "Lucas Dubois",
      avatar: "LD",
      assignmentTitle: "Essay: Mon Vacances",
      description: "A 500-word essay about summer vacation in French. Includes past tense practice and descriptive vocabulary.",
      submissionDate: "Oct 19, 2025 - 1:15 PM",
      reviewStatus: "Submitted",
      teacherNotes: "",
      reviewDate: "",
      grade: ""
    },
    {
      id: 3,
      studentName: "Sophie Bernard",
      avatar: "SB",
      assignmentTitle: "Vocabulary Quiz Chapter 4",
      description: "50 vocabulary words with translations and example sentences.",
      submissionDate: "Oct 18, 2025 - 5:45 PM",
      reviewStatus: "Reviewed",
      teacherNotes: "Excellent work! Very thorough examples. Minor spelling errors on questions 12 and 34.",
      reviewDate: "Oct 19, 2025 - 9:00 AM",
      grade: "A"
    },
    {
      id: 4,
      studentName: "Thomas Petit",
      avatar: "TP",
      assignmentTitle: "Listening Comprehension",
      description: "Answered questions based on three audio clips covering different topics.",
      submissionDate: "Oct 18, 2025 - 2:20 PM",
      reviewStatus: "Approved",
      teacherNotes: "Good understanding of the audio. All answers correct!",
      reviewDate: "Oct 18, 2025 - 4:00 PM",
      grade: "A+"
    },
    {
      id: 5,
      studentName: "Chloé Rousseau",
      avatar: "CR",
      assignmentTitle: "French Culture Report",
      description: "Research report on French cuisine traditions and regional specialties.",
      submissionDate: "Oct 17, 2025 - 11:30 AM",
      reviewStatus: "Needs Revision",
      teacherNotes: "Great topic choice! Please add more details about regional variations and include at least 3 sources.",
      reviewDate: "Oct 18, 2025 - 10:00 AM",
      grade: "B"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-orange-200 text-orange-700 hover:bg-orange-200";
      case "Reviewed":
        return "bg-blue-200 text-blue-700 hover:bg-blue-200";
      case "Approved":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Needs Revision":
        return "bg-red-200 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  const submittedCount = homeworkSubmissions.filter(h => h.reviewStatus === "Submitted").length;
  const reviewedCount = homeworkSubmissions.filter(h => h.reviewStatus === "Reviewed").length;
  const approvedCount = homeworkSubmissions.filter(h => h.reviewStatus === "Approved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            📝 Homework & Assignments (تکالیف)
          </h2>
          <p className="text-gray-600">Review and grade student submissions ✨</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-orange-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-orange-600">{submittedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-blue-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reviewed</p>
                <p className="text-blue-600">{reviewedCount}</p>
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

        <Card className="border-pink-200 bg-pink-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-pink-600">{homeworkSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Homework Submissions</CardTitle>
          <CardDescription>Review and provide feedback on student assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-pink-200 hover:bg-pink-50">
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment Title</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {homeworkSubmissions.map((homework) => (
                    <TableRow key={homework.id} className="border-pink-200 hover:bg-pink-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300 text-white">
                              {homework.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span>{homework.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{homework.assignmentTitle}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{homework.submissionDate}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(homework.reviewStatus)}>
                          {homework.reviewStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {homework.grade ? (
                          <Badge variant="outline" className="border-purple-300 text-purple-600">
                            {homework.grade}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-pink-300 text-pink-600 hover:bg-pink-50 rounded-xl"
                              onClick={() => setSelectedHomework(homework)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-pink-600">Review Assignment</DialogTitle>
                              <DialogDescription>Provide feedback for {homework.studentName}</DialogDescription>
                            </DialogHeader>
                            {selectedHomework && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Student Name</p>
                                    <p>{selectedHomework.studentName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Assignment Title</p>
                                    <p>{selectedHomework.assignmentTitle}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Submission Date</p>
                                    <p className="text-sm">{selectedHomework.submissionDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Current Status</p>
                                    <Badge className={getStatusColor(selectedHomework.reviewStatus)}>
                                      {selectedHomework.reviewStatus}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="p-4 bg-purple-50 rounded-xl">
                                  <p className="text-sm mb-1 text-gray-600">Description:</p>
                                  <p className="text-gray-800">{selectedHomework.description}</p>
                                </div>

                                {selectedHomework.teacherNotes && (
                                  <div className="p-4 bg-blue-50 rounded-xl">
                                    <p className="text-sm mb-1 text-gray-600">Previous Feedback:</p>
                                    <p className="text-gray-800">{selectedHomework.teacherNotes}</p>
                                  </div>
                                )}

                                <div>
                                  <label className="text-sm text-gray-600 mb-2 block">Teacher Feedback:</label>
                                  <Textarea
                                    placeholder="Provide detailed feedback..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="min-h-32 border-pink-200"
                                  />
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                  <Button className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Request Revision
                                  </Button>
                                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Mark as Reviewed
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
          <CardTitle className="text-pink-600">💡 Grading Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-pink-700">
            <li>✨ Provide specific, constructive feedback</li>
            <li>📚 Highlight both strengths and areas for improvement</li>
            <li>💬 Use encouraging language to motivate students</li>
            <li>⭐ Grade assignments within 48 hours of submission</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}