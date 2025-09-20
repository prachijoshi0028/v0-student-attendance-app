"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Users, TrendingUp, QrCode, ArrowLeft, Wifi, Camera } from "lucide-react"

export function ClassroomDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [attendanceCount, setAttendanceCount] = useState(28)

  useEffect(() => {
    // Update time every second for real-time display
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    // Simulate real-time attendance updates
    const attendanceTimer = setInterval(() => {
      // Randomly update attendance (simulate students marking attendance)
      if (Math.random() > 0.8 && attendanceCount < 32) {
        setAttendanceCount((prev) => prev + 1)
      }
    }, 5000)

    return () => {
      clearInterval(timer)
      clearInterval(attendanceTimer)
    }
  }, [attendanceCount])

  const classInfo = {
    subject: "Computer Science",
    instructor: "Prof. Michael Brown",
    class: "10A",
    room: "Lab 1",
    time: "12:00 - 13:00",
    totalStudents: 32,
  }

  const attendancePercentage = Math.round((attendanceCount / classInfo.totalStudents) * 100)

  const recentAttendance = [
    { name: "Alex Johnson", time: "12:01", method: "QR Code", status: "present" },
    { name: "Sarah Chen", time: "12:02", method: "Face Recognition", status: "present" },
    { name: "Emma Davis", time: "12:03", method: "Proximity", status: "present" },
    { name: "James Brown", time: "12:15", method: "QR Code", status: "late" },
  ]

  const attendanceMethods = [
    { method: "QR Code", count: 18, icon: QrCode },
    { method: "Face Recognition", count: 8, icon: Camera },
    { method: "Proximity", count: 6, icon: Wifi },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/staff/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Classroom Display</h1>
          <p className="text-muted-foreground">Real-time attendance monitoring</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{currentTime.toLocaleTimeString()}</div>
          <div className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()}</div>
        </div>
      </div>

      {/* Class Information */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{classInfo.subject}</CardTitle>
              <p className="text-lg text-muted-foreground">{classInfo.instructor}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {classInfo.class}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {classInfo.room} • {classInfo.time}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Attendance Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-6 w-6" />
                Live Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">{attendanceCount}</div>
                  <div className="text-xl text-muted-foreground">out of {classInfo.totalStudents} students</div>
                  <div className="text-3xl font-semibold text-primary mt-2">{attendancePercentage}%</div>
                </div>
                <Progress value={attendancePercentage} className="h-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{attendanceCount}</div>
                    <div className="text-sm text-muted-foreground">Present</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{classInfo.totalStudents - attendanceCount}</div>
                    <div className="text-sm text-muted-foreground">Absent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-sm text-muted-foreground">Late</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttendance.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
                        <div className="text-sm text-muted-foreground">{student.method}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">{student.time}</div>
                      <Badge
                        variant={student.status === "present" ? "default" : "secondary"}
                        className={
                          student.status === "present" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {student.status === "present" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Attendance Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceMethods.map((method, index) => {
                  const Icon = method.icon
                  const percentage = Math.round((method.count / attendanceCount) * 100)
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{method.method}</span>
                        </div>
                        <span className="text-sm font-bold">{method.count}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">{percentage}%</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* QR Code for Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Scan to Mark Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{classInfo.subject}</p>
                  <p className="text-xs text-muted-foreground">{classInfo.room}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Scan with EduAttend App
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Class Status */}
          <Card>
            <CardHeader>
              <CardTitle>Class Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    In Progress
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Duration</span>
                  <span className="text-sm font-medium">60 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time Remaining</span>
                  <span className="text-sm font-medium">45 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Attendance Goal</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
