import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function QuestionsSupport() {
  const [selectedQuestion, setSelectedQuestion] = useState<typeof questions[0] | null>(null);
  const [response, setResponse] = useState("");

  const questions = [
    {
      id: 1,
      studentName: "Marie Laurent",
      contact: "@marielaurent",
      avatar: "ML",
      question: "How do I conjugate 'être' in passé composé? I'm confused about the agreement rules.",
      submissionDate: "Oct 19, 2025 - 2:30 PM",
      responseStatus: "Pending",
      teacherResponse: "",
      responseDate: ""
    },
    {
      id: 2,
      studentName: "Pierre Leroy",
      contact: "@pierreleroy",
      avatar: "PL",
      question: "What's the difference between 'savoir' and 'connaître'? When should I use each one?",
      submissionDate: "Oct 19, 2025 - 10:15 AM",
      responseStatus: "Pending",
      teacherResponse: "",
      responseDate: ""
    },
    {
      id: 3,
      studentName: "Julie Moreau",
      contact: "@juliemoreau",
      avatar: "JM",
      question: "When should I use the subjunctive mood? Can you give me some examples?",
      submissionDate: "Oct 18, 2025 - 4:45 PM",
      responseStatus: "Answered",
      teacherResponse: "The subjunctive is used to express doubt, wishes, emotions, and uncertainty. For example: 'Il faut que tu viennes' (You must come). Common triggers include 'il faut que', 'bien que', 'pour que', etc.",
      responseDate: "Oct 18, 2025 - 6:00 PM"
    },
    {
      id: 4,
      studentName: "Camille Girard",
      contact: "@camillegirard",
      avatar: "CG",
      question: "Can you explain the difference between passé composé and imparfait?",
      submissionDate: "Oct 18, 2025 - 1:20 PM",
      responseStatus: "Answered",
      teacherResponse: "Passé composé is used for completed actions (J'ai mangé - I ate), while imparfait describes ongoing past actions or habits (Je mangeais - I was eating/used to eat). Think of passé composé as a snapshot and imparfait as a video.",
      responseDate: "Oct 18, 2025 - 3:30 PM"
    },
    {
      id: 5,
      studentName: "Antoine Simon",
      contact: "@antoines",
      avatar: "AS",
      question: "How do I know when to use 'de' vs 'du' vs 'de la' vs 'des'?",
      submissionDate: "Oct 17, 2025 - 11:00 AM",
      responseStatus: "Pending",
      teacherResponse: "",
      responseDate: ""
    }
  ];

  const pendingCount = questions.filter(q => q.responseStatus === "Pending").length;
  const answeredCount = questions.filter(q => q.responseStatus === "Answered").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            ❓ Questions & Support (سوالات)
          </h2>
          <p className="text-gray-600">Manage student questions and provide support ✨</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-pink-200 bg-orange-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Questions</p>
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
                <p className="text-sm text-gray-600">Answered</p>
                <p className="text-green-600">{answeredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-blue-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-blue-600">2.5 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Student Questions</CardTitle>
          <CardDescription>View and respond to student inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className={`p-5 rounded-2xl border-2 transition-all hover:shadow-md ${
                  question.responseStatus === "Pending"
                    ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200"
                    : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300 text-white">
                        {question.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-800">{question.studentName}</p>
                      <p className="text-sm text-gray-500">{question.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        question.responseStatus === "Pending"
                          ? "bg-orange-200 text-orange-700 hover:bg-orange-200"
                          : "bg-green-200 text-green-700 hover:bg-green-200"
                      }
                    >
                      {question.responseStatus}
                    </Badge>
                    <span className="text-xs text-gray-500">{question.submissionDate}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm mb-1 text-gray-500">Question:</p>
                  <p className="text-gray-800">{question.question}</p>
                </div>

                {question.responseStatus === "Answered" && (
                  <div className="mb-3 p-3 bg-white rounded-xl">
                    <p className="text-sm mb-1 text-gray-500">Teacher Response:</p>
                    <p className="text-gray-800 text-sm">{question.teacherResponse}</p>
                    <p className="text-xs text-gray-400 mt-2">Answered on {question.responseDate}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {question.responseStatus === "Pending" ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl"
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Answer Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-pink-600">Answer Question</DialogTitle>
                          <DialogDescription>Provide a helpful response to {question.studentName}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="text-sm mb-1 text-gray-600">Question:</p>
                            <p className="text-gray-800">{question.question}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-2 block">Your Response:</label>
                            <Textarea
                              placeholder="Type your answer here..."
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              className="min-h-32 border-pink-200"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Send Response
                            </Button>
                            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl">
                              Mark as Resolved
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Follow-up
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-200 bg-gradient-to-br from-purple-100 to-pink-100">
        <CardHeader>
          <CardTitle className="text-purple-600">💡 Support Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-purple-700">
            <li>✨ Respond to questions within 24 hours for best engagement</li>
            <li>📚 Provide examples and resources in your answers</li>
            <li>💬 Use encouraging language to motivate students</li>
            <li>🔄 Follow up on complex questions to ensure understanding</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
