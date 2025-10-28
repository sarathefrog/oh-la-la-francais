import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DollarSign, CheckCircle, Clock, XCircle, RefreshCw, Download } from "lucide-react";

export function PaymentsFinance() {
  const payments = [
    {
      id: 1,
      studentName: "Emma Martin",
      avatar: "EM",
      amount: "€250",
      currency: "EUR",
      paymentMethod: "Bank Transfer",
      paymentStatus: "Completed",
      paymentDate: "Oct 15, 2025",
      description: "Monthly tuition - October 2025"
    },
    {
      id: 2,
      studentName: "Lucas Dubois",
      avatar: "LD",
      amount: "€180",
      currency: "EUR",
      paymentMethod: "Cash",
      paymentStatus: "Pending",
      paymentDate: "Oct 10, 2025",
      description: "8 private sessions package"
    },
    {
      id: 3,
      studentName: "Sophie Bernard",
      avatar: "SB",
      amount: "€300",
      currency: "EUR",
      paymentMethod: "Online Payment",
      paymentStatus: "Completed",
      paymentDate: "Oct 18, 2025",
      description: "Monthly tuition - October 2025"
    },
    {
      id: 4,
      studentName: "Thomas Petit",
      avatar: "TP",
      amount: "€200",
      currency: "EUR",
      paymentMethod: "Crypto",
      paymentStatus: "Failed",
      paymentDate: "Oct 12, 2025",
      description: "12 group sessions package"
    },
    {
      id: 5,
      studentName: "Chloé Rousseau",
      avatar: "CR",
      amount: "€150",
      currency: "EUR",
      paymentMethod: "Bank Transfer",
      paymentStatus: "Refunded",
      paymentDate: "Oct 5, 2025",
      description: "Cancelled course refund"
    },
    {
      id: 6,
      studentName: "Marie Laurent",
      avatar: "ML",
      amount: "€220",
      currency: "EUR",
      paymentMethod: "Online Payment",
      paymentStatus: "Pending",
      paymentDate: "Oct 16, 2025",
      description: "10 sessions package"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-200 text-green-700 hover:bg-green-200";
      case "Pending":
        return "bg-orange-200 text-orange-700 hover:bg-orange-200";
      case "Failed":
        return "bg-red-200 text-red-700 hover:bg-red-200";
      case "Refunded":
        return "bg-blue-200 text-blue-700 hover:bg-blue-200";
      default:
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
    }
  };

  const completedCount = payments.filter(p => p.paymentStatus === "Completed").length;
  const pendingCount = payments.filter(p => p.paymentStatus === "Pending").length;
  const totalRevenue = "€1,300";
  const monthlyGrowth = "+12%";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            💰 Payments & Finance (پرداخت‌ها)
          </h2>
          <p className="text-gray-600">Track payments and financial transactions ✨</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-green-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-green-600">{totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-blue-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-blue-600">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card className="border-pink-200 bg-purple-50 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Growth</p>
                <p className="text-purple-600">{monthlyGrowth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600">Payment Information</CardTitle>
          <CardDescription>View and manage all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-pink-200 hover:bg-pink-50">
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="border-pink-200 hover:bg-pink-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-300 text-white">
                              {payment.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span>{payment.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{payment.amount}</p>
                        <p className="text-xs text-gray-500">{payment.currency}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-purple-300 text-purple-600">
                          {payment.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.paymentStatus)}>
                          {payment.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{payment.paymentDate}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{payment.description}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {payment.paymentStatus === "Pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Remind
                            </Button>
                          )}
                          {payment.paymentStatus === "Failed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Retry
                            </Button>
                          )}
                          {payment.paymentStatus === "Completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
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
        <Card className="border-pink-200 bg-gradient-to-br from-green-100 to-emerald-100">
          <CardHeader>
            <CardTitle className="text-green-600">💵 Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm text-gray-600">Private Sessions</span>
                <span className="text-green-600">€580</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm text-gray-600">Group Sessions</span>
                <span className="text-green-600">€550</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm text-gray-600">Materials</span>
                <span className="text-green-600">€170</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-pink-100 to-rose-100">
          <CardHeader>
            <CardTitle className="text-pink-600">💡 Financial Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-pink-700">
              <li>✨ Send payment reminders 3 days before due date</li>
              <li>📊 Generate monthly financial reports</li>
              <li>💳 Offer multiple payment method options</li>
              <li>🎁 Consider early payment discounts</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}