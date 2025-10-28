import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Bell, Send, Calendar, DollarSign, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function NotificationsCommunications() {
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const recentNotifications = [
    {
      id: 1,
      type: "Class Reminder",
      recipient: "Emma Martin",
      message: "Reminder: Your French class is scheduled for tomorrow at 10:00 AM",
      sentDate: "Oct 19, 2025 - 8:00 AM",
      status: "Delivered",
      icon: Calendar
    },
    {
      id: 2,
      type: "Payment Reminder",
      recipient: "Lucas Dubois",
      message: "Your payment of €180 is due in 3 days. Please complete payment to continue classes.",
      sentDate: "Oct 19, 2025 - 9:30 AM",
      status: "Delivered",
      icon: DollarSign
    },
    {
      id: 3,
      type: "Low Session Warning",
      recipient: "Sophie Bernard",
      message: "You have 2 sessions remaining. Consider purchasing a new package to continue learning!",
      sentDate: "Oct 18, 2025 - 6:00 PM",
      status: "Delivered",
      icon: AlertTriangle
    },
    {
      id: 4,
      type: "Booking Confirmation",
      recipient: "Thomas Petit",
      message: "Your makeup class has been scheduled for Oct 25 at 2:00 PM. Google Meet link: meet.google.com/xyz",
      sentDate: "Oct 18, 2025 - 3:15 PM",
      status: "Delivered",
      icon: CheckCircle
    },
    {
      id: 5,
      type: "System Alert",
      recipient: "All Students",
      message: "The bot will undergo maintenance on Oct 22 from 2-3 AM. Services may be temporarily unavailable.",
      sentDate: "Oct 17, 2025 - 10:00 AM",
      status: "Delivered",
      icon: Bell
    }
  ];

  const notificationStats = [
    { label: "Sent Today", value: "24", icon: Send, color: "from-blue-400 to-cyan-400" },
    { label: "Delivery Rate", value: "98%", icon: CheckCircle, color: "from-green-400 to-emerald-400" },
    { label: "Pending", value: "3", icon: Clock, color: "from-orange-400 to-yellow-400" },
    { label: "Scheduled", value: "8", icon: Calendar, color: "from-purple-400 to-pink-400" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            🔔 Notifications & Communications (اعلان‌ها)
          </h2>
          <p className="text-gray-600">Manage notifications and communicate with students ✨</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-pink-600">Send Bulk Message</DialogTitle>
              <DialogDescription>Send a message to selected students or all students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Recipient Group:</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="border-pink-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="approved">Approved Students</SelectItem>
                    <SelectItem value="pending">Pending Students</SelectItem>
                    <SelectItem value="low-sessions">Low Session Students</SelectItem>
                    <SelectItem value="overdue">Overdue Payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Message:</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-32 border-pink-200"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl">
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
                <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {notificationStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
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
          <CardTitle className="text-pink-600">Recent Notifications</CardTitle>
          <CardDescription>Track all sent messages and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-purple-300 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-pink-300 text-pink-600">
                            {notification.type}
                          </Badge>
                          <span className="text-sm text-gray-600">{notification.recipient}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-200 text-green-700 hover:bg-green-200">
                            {notification.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{notification.sentDate}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{notification.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-pink-200 bg-gradient-to-br from-pink-100 to-rose-100">
          <CardHeader>
            <CardTitle className="text-pink-600 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start bg-white hover:bg-pink-50 text-pink-600 rounded-xl">
                <Calendar className="w-4 h-4 mr-2" />
                Send Class Reminders (24h before)
              </Button>
              <Button className="w-full justify-start bg-white hover:bg-pink-50 text-pink-600 rounded-xl">
                <DollarSign className="w-4 h-4 mr-2" />
                Send Payment Reminders
              </Button>
              <Button className="w-full justify-start bg-white hover:bg-pink-50 text-pink-600 rounded-xl">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Low Session Warnings
              </Button>
              <Button className="w-full justify-start bg-white hover:bg-pink-50 text-pink-600 rounded-xl">
                <Users className="w-4 h-4 mr-2" />
                Welcome New Students
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-purple-100 to-pink-100">
          <CardHeader>
            <CardTitle className="text-purple-600">💡 Communication Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-purple-700">
              <li>✨ Send class reminders 24 hours in advance</li>
              <li>📅 Schedule bulk messages during off-peak hours</li>
              <li>💬 Personalize messages when possible</li>
              <li>🔔 Keep notifications concise and action-oriented</li>
              <li>📊 Track delivery rates to optimize timing</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="text-blue-600">📋 Notification Templates</CardTitle>
          <CardDescription>Pre-written templates for common notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-blue-200">
              <p className="text-sm mb-2 text-blue-600">Class Reminder</p>
              <p className="text-xs text-gray-600">"Hi {'{'}name{'}'}, reminder: Your French class is tomorrow at {'{'}time{'}'}. See you there! 📚"</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-blue-200">
              <p className="text-sm mb-2 text-blue-600">Payment Due</p>
              <p className="text-xs text-gray-600">"Hi {'{'}name{'}'}, your payment of {'{'}amount{'}'} is due in 3 days. Please complete to avoid interruption. 💳"</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-blue-200">
              <p className="text-sm mb-2 text-blue-600">Welcome Message</p>
              <p className="text-xs text-gray-600">"Welcome to our French class, {'{'}name{'}'}! We're excited to help you learn. Let's get started! 🎉"</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-blue-200">
              <p className="text-sm mb-2 text-blue-600">Low Sessions</p>
              <p className="text-xs text-gray-600">"Hi {'{'}name{'}'}, you have {'{'}count{'}'} sessions left. Book more to continue your learning journey! 📖"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Clock } from "lucide-react";
