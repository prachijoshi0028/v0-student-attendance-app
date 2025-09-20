"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chatbox } from "@/components/chatbox"
import {
  Calendar,
  Clock,
  QrCode,
  Wifi,
  Camera,
  BookOpen,
  Target,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  CheckCircle,
  CalendarDays,
  Trophy,
} from "lucide-react"
import { getCurrentUser, type Student } from "@/lib/auth"

export function StudentDashboard() {
  const [user, setUser] = useState<Student | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Set user type for demo
    localStorage.setItem("userType", "student")
    const currentUser = getCurrentUser() as Student
    setUser(currentUser)

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (!user) return <div>Loading...</div>

  const todaySchedule = [
    { time: "09:00", subject: "Mathematics", room: "Room 101", status: "present" },
    { time: "10:00", subject: "Physics", room: "Room 203", status: "present" },
    { time: "11:00", subject: "Free Period", room: "-", status: "free" },
    { time: "12:00", subject: "Computer Science", room: "Lab 1", status: "upcoming" },
    { time: "13:00", subject: "Lunch Break", room: "Cafeteria", status: "upcoming" },
  ]

  const attendanceStats = {
    present: 85,
    total: 100,
    percentage: 85,
  }

  const recommendedTasks = [
    {
      title: "Complete Algebra Practice Set",
      subject: "Mathematics",
      duration: "30 mins",
      priority: "high",
      reason: "Based on your strength in problem solving",
    },
    {
      title: "Review Physics Formulas",
      subject: "Physics",
      duration: "20 mins",
      priority: "medium",
      reason: "Upcoming test preparation",
    },
    {
      title: "Python Programming Tutorial",
      subject: "Computer Science",
      duration: "45 mins",
      priority: "high",
      reason: "Aligns with your career goal: Software Engineer",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">EduAttend</h1>
            <Badge variant="secondary">{user.class}</Badge>
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
            <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Student ID: {user.studentId}</p>
          </div>
          <Button onClick={() => (window.location.href = "/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Attendance Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{attendanceStats.percentage}%</div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats.present} of {attendanceStats.total} classes
              </p>
              <Progress value={attendanceStats.percentage} className="mt-2" />
            </CardContent>
          </Card>

          {/* Quick Attendance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mark Attendance</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" onClick={() => (window.location.href = "/student/attendance")}>
                <QrCode className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Wifi className="h-4 w-4 mr-1" />
                  Proximity
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Camera className="h-4 w-4 mr-1" />
                  Face ID
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smart Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" onClick={() => (window.location.href = "/student/tasks")}>
                <BookOpen className="h-4 w-4 mr-2" />
                View Tasks
              </Button>
              <p className="text-xs text-muted-foreground">3 personalized recommendations</p>
            </CardContent>
          </Card>

          {/* Daily Routine */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Routine</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" onClick={() => (window.location.href = "/student/routine")}>
                <CalendarDays className="h-4 w-4 mr-2" />
                View Routine
              </Button>
              <p className="text-xs text-muted-foreground">AI-generated schedule</p>
            </CardContent>
          </Card>

          {/* Extra-Curricular Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" onClick={() => (window.location.href = "/student/activities")}>
                <Trophy className="h-4 w-4 mr-2" />
                View Activities
              </Button>
              <p className="text-xs text-muted-foreground">Track your achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
            <TabsTrigger value="tasks">Recommended Tasks</TabsTrigger>
            <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your classes and activities for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium w-16">{item.time}</div>
                        <div>
                          <div className="font-medium">{item.subject}</div>
                          <div className="text-sm text-muted-foreground">{item.room}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === "present" && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Present
                          </Badge>
                        )}
                        {item.status === "upcoming" && (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Upcoming
                          </Badge>
                        )}
                        {item.status === "free" && (
                          <Badge variant="outline" className="text-blue-600">
                            <Target className="h-3 w-3 mr-1" />
                            Free Time
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Tasks
                </CardTitle>
                <CardDescription>Personalized tasks based on your interests and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedTasks.map((task, index) => (
                    <div key={index} className="p-4 rounded-lg border space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {task.subject}
                            </Badge>
                            <span>{task.duration}</span>
                          </div>
                        </div>
                        <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{task.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.reason}</p>
                      <Button size="sm" className="w-full" onClick={() => (window.location.href = "/student/tasks")}>
                        View All Tasks
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Career Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.careerGoals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="mr-2">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.strengths.map((strength, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.interests.map((interest, index) => (
                      <Badge key={index} variant="default" className="mr-2">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Chatbox */}
      <Chatbox />
    </div>
  )
}
