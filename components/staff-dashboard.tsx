"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Monitor,
  BookOpen,
  Target,
  BarChart3,
} from "lucide-react"
import { getCurrentUser, type Staff } from "@/lib/auth"

export function StaffDashboard() {
  const [user, setUser] = useState<Staff | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedClass, setSelectedClass] = useState("10A")

  useEffect(() => {
    // Set user type for demo
    localStorage.setItem("userType", "staff")
    const currentUser = getCurrentUser() as Staff
    setUser(currentUser)

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (!user) return <div>Loading...</div>

  const classStats = {
    totalStudents: 32,
    presentToday: 28,
    absentToday: 4,
    attendanceRate: 87.5,
  }

  const todayClasses = [
    { time: "09:00", subject: "Mathematics", class: "10A", room: "Room 101", attendance: "28/32" },
    { time: "11:00", subject: "Mathematics", class: "10B", room: "Room 102", attendance: "30/30" },
    { time: "14:00", subject: "Statistics", class: "12A", room: "Room 101", attendance: "Upcoming" },
  ]

  const studentList = [
    { id: "ST001", name: "Alex Johnson", class: "10A", status: "present", time: "08:55", method: "QR Code" },
    { id: "ST002", name: "Sarah Chen", class: "10A", status: "present", time: "08:58", method: "Face Recognition" },
    { id: "ST003", name: "Mike Wilson", class: "10A", status: "absent", time: "-", method: "-" },
    { id: "ST004", name: "Emma Davis", class: "10A", status: "present", time: "09:02", method: "Proximity" },
    { id: "ST005", name: "James Brown", class: "10A", status: "late", time: "09:15", method: "QR Code" },
  ]

  const weeklyTrends = [
    { day: "Mon", attendance: 92 },
    { day: "Tue", attendance: 88 },
    { day: "Wed", attendance: 95 },
    { day: "Thu", attendance: 87 },
    { day: "Fri", attendance: 90 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">EduAttend Staff</h1>
            <Badge variant="secondary">{user.department}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
            <p className="text-muted-foreground">{user.department} Department</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => (window.location.href = "/staff/classroom-display")}>
              <Monitor className="h-4 w-4 mr-2" />
              Classroom Display
            </Button>
            <Button onClick={() => (window.location.href = "/")}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{classStats.presentToday}</div>
              <p className="text-xs text-muted-foreground">Students in attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{classStats.absentToday}</div>
              <p className="text-xs text-muted-foreground">Students absent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{classStats.attendanceRate}%</div>
              <Progress value={classStats.attendanceRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Live Attendance</TabsTrigger>
            <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Label htmlFor="class-select">Class:</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10A">10A</SelectItem>
                    <SelectItem value="10B">10B</SelectItem>
                    <SelectItem value="12A">12A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Class {selectedClass} - Live Attendance
                </CardTitle>
                <CardDescription>Real-time attendance tracking for current class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentList.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          {student.time !== "-" && <div>{student.time}</div>}
                          {student.method !== "-" && <div className="text-muted-foreground">{student.method}</div>}
                        </div>
                        <Badge
                          variant={
                            student.status === "present"
                              ? "default"
                              : student.status === "late"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            student.status === "present"
                              ? "bg-green-100 text-green-800"
                              : student.status === "late"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {student.status === "present" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {student.status === "absent" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {student.status === "late" && <Clock className="h-3 w-3 mr-1" />}
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Teaching Schedule
                </CardTitle>
                <CardDescription>Your classes and attendance overview for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayClasses.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium w-16">{classItem.time}</div>
                        <div>
                          <div className="font-medium">{classItem.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {classItem.class} • {classItem.room}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">{classItem.attendance}</div>
                          <div className="text-sm text-muted-foreground">Attendance</div>
                        </div>
                        {classItem.attendance !== "Upcoming" ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Upcoming
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Attendance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyTrends.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-12">{day.day}</span>
                        <div className="flex-1 mx-3">
                          <Progress value={day.attendance} className="h-2" />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{day.attendance}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">QR Code</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20 h-2" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Face Recognition</span>
                      <div className="flex items-center gap-2">
                        <Progress value={35} className="w-20 h-2" />
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Proximity</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-20 h-2" />
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="10A">Class 10A</SelectItem>
                  <SelectItem value="10B">Class 10B</SelectItem>
                  <SelectItem value="12A">Class 12A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage student profiles and academic recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentList.slice(0, 3).map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.id} • Class {student.class}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Tasks
                        </Button>
                        <Button variant="outline" size="sm">
                          <Target className="h-4 w-4 mr-1" />
                          Goals
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
