import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Settings, Key, Database, HardDrive, Clock, DollarSign, Users, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function SettingsConfiguration() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pink-600 flex items-center gap-2">
            ⚙️ Settings & Configuration (تنظیمات)
          </h2>
          <p className="text-gray-600">Configure system settings and preferences ✨</p>
        </div>
      </div>

      <Card className="border-pink-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <Tabs defaultValue="bot-config">
            <TabsList className="bg-pink-100 p-1 rounded-xl mb-6">
              <TabsTrigger value="bot-config" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                <Settings className="w-4 h-4 mr-2" />
                Bot Config
              </TabsTrigger>
              <TabsTrigger value="class-settings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                <Clock className="w-4 h-4 mr-2" />
                Class Settings
              </TabsTrigger>
              <TabsTrigger value="pricing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600">
                <Users className="w-4 h-4 mr-2" />
                User Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bot-config" className="space-y-6">
              <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-pink-600 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Telegram Bot Settings
                  </CardTitle>
                  <CardDescription>Configure your Telegram bot connection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bot-token">Bot Token</Label>
                    <Input
                      id="bot-token"
                      type="password"
                      placeholder="Enter your Telegram bot token"
                      className="mt-2 border-pink-200"
                      defaultValue="••••••••••••••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bot-username">Bot Username</Label>
                    <Input
                      id="bot-username"
                      placeholder="@your_bot_username"
                      className="mt-2 border-pink-200"
                      defaultValue="@french_class_bot"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <p className="text-sm">Enable Bot Notifications</p>
                      <p className="text-xs text-gray-500">Send automatic notifications to students</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl">
                    Save Bot Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-pink-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardHeader>
                  <CardTitle className="text-blue-600 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Keys Management
                  </CardTitle>
                  <CardDescription>Manage external API integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="google-meet">Google Meet API Key</Label>
                    <Input
                      id="google-meet"
                      type="password"
                      placeholder="Enter Google Meet API key"
                      className="mt-2 border-blue-200"
                      defaultValue="••••••••••••••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-api">Payment Gateway API Key</Label>
                    <Input
                      id="payment-api"
                      type="password"
                      placeholder="Enter payment API key"
                      className="mt-2 border-blue-200"
                      defaultValue="••••••••••••••••••••"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl">
                    Save API Keys
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-pink-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-purple-600 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Database Settings
                  </CardTitle>
                  <CardDescription>Configure database connection and backup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="db-host">Database Host</Label>
                    <Input
                      id="db-host"
                      placeholder="localhost"
                      className="mt-2 border-purple-200"
                      defaultValue="localhost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="db-name">Database Name</Label>
                    <Input
                      id="db-name"
                      placeholder="french_class_db"
                      className="mt-2 border-purple-200"
                      defaultValue="french_class_db"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <p className="text-sm">Auto Backup</p>
                      <p className="text-xs text-gray-500">Daily automatic database backup</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl">
                    <HardDrive className="w-4 h-4 mr-2" />
                    Backup Now
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="class-settings" className="space-y-6">
              <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
                <CardHeader>
                  <CardTitle className="text-pink-600">Class Duration & Scheduling</CardTitle>
                  <CardDescription>Set default class settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="class-duration">Default Class Duration (minutes)</Label>
                    <Select defaultValue="60">
                      <SelectTrigger className="mt-2 border-pink-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="break-time">Break Between Classes (minutes)</Label>
                    <Select defaultValue="15">
                      <SelectTrigger className="mt-2 border-pink-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No break</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <p className="text-sm">Allow Weekend Classes</p>
                      <p className="text-xs text-gray-500">Enable class scheduling on Saturdays and Sundays</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl">
                    Save Class Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-pink-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-blue-600">Available Time Slots</CardTitle>
                  <CardDescription>Configure available teaching hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Start Time</Label>
                      <Select defaultValue="08:00">
                        <SelectTrigger className="mt-2 border-blue-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="end-time">End Time</Label>
                      <Select defaultValue="20:00">
                        <SelectTrigger className="mt-2 border-blue-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18:00">6:00 PM</SelectItem>
                          <SelectItem value="20:00">8:00 PM</SelectItem>
                          <SelectItem value="21:00">9:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl">
                    Update Time Slots
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card className="border-pink-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-green-600">Pricing Configuration</CardTitle>
                  <CardDescription>Set prices for different class types</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="private-price">Private Class (per session)</Label>
                      <Input
                        id="private-price"
                        type="number"
                        placeholder="0"
                        className="mt-2 border-green-200"
                        defaultValue="25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="group-price">Group Class (per session)</Label>
                      <Input
                        id="group-price"
                        type="number"
                        placeholder="0"
                        className="mt-2 border-green-200"
                        defaultValue="15"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="EUR">
                      <SelectTrigger className="mt-2 border-green-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <p className="text-sm">Enable Package Discounts</p>
                      <p className="text-xs text-gray-500">Offer discounts for bulk session purchases</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl">
                    Save Pricing
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="border-pink-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-purple-600 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    User Management & Permissions
                  </CardTitle>
                  <CardDescription>Manage teacher access and administrator roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p>Admin Access</p>
                        <p className="text-xs text-gray-500">Full system access and configuration</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p>Teacher Access</p>
                        <p className="text-xs text-gray-500">View and manage students and classes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p>Student Self-Service</p>
                        <p className="text-xs text-gray-500">Allow students to manage their own profiles</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl">
                    Save Permissions
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-pink-200 bg-gradient-to-br from-pink-100 to-rose-100">
                <CardHeader>
                  <CardTitle className="text-pink-600">💡 Security Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-pink-700">
                    <li>🔐 Use strong, unique passwords for all admin accounts</li>
                    <li>🔑 Rotate API keys regularly for security</li>
                    <li>💾 Enable automatic backups to prevent data loss</li>
                    <li>👥 Limit admin access to trusted personnel only</li>
                    <li>📊 Review access logs periodically</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
