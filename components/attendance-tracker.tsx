"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QrCode, Wifi, Camera, CheckCircle, Clock, MapPin, ArrowLeft, AlertCircle } from "lucide-react"

export function AttendanceTracker() {
  const [attendanceMethod, setAttendanceMethod] = useState<"qr" | "proximity" | "face" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [attendanceStatus, setAttendanceStatus] = useState<"success" | "error" | null>(null)
  const [currentClass, setCurrentClass] = useState({
    subject: "Computer Science",
    room: "Lab 1",
    time: "12:00 - 13:00",
    instructor: "Prof. Michael Brown",
  })

  const handleAttendance = async (method: "qr" | "proximity" | "face") => {
    setAttendanceMethod(method)
    setIsScanning(true)
    setAttendanceStatus(null)

    // Simulate attendance marking process
    setTimeout(() => {
      setIsScanning(false)
      // Randomly simulate success/error for demo
      const success = Math.random() > 0.2
      setAttendanceStatus(success ? "success" : "error")

      if (success) {
        setTimeout(() => {
          setAttendanceStatus(null)
          setAttendanceMethod(null)
        }, 3000)
      }
    }, 2000)
  }

  const attendanceHistory = [
    { date: "2024-01-15", subject: "Mathematics", status: "present", time: "09:00", method: "QR Code" },
    { date: "2024-01-15", subject: "Physics", status: "present", time: "10:00", method: "Face Recognition" },
    { date: "2024-01-14", subject: "Chemistry", status: "absent", time: "11:00", method: "-" },
    { date: "2024-01-14", subject: "English", status: "present", time: "14:00", method: "Proximity" },
    { date: "2024-01-13", subject: "Mathematics", status: "present", time: "09:00", method: "QR Code" },
  ]

  const weeklyStats = {
    present: 18,
    absent: 2,
    total: 20,
    percentage: 90,
  }

  if (attendanceMethod && isScanning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
              {attendanceMethod === "qr" && <QrCode className="h-8 w-8 text-primary mx-auto" />}
              {attendanceMethod === "proximity" && <Wifi className="h-8 w-8 text-primary mx-auto" />}
              {attendanceMethod === "face" && <Camera className="h-8 w-8 text-primary mx-auto" />}
            </div>
            <CardTitle>
              {attendanceMethod === "qr" && "Scanning QR Code"}
              {attendanceMethod === "proximity" && "Detecting Proximity"}
              {attendanceMethod === "face" && "Face Recognition"}
            </CardTitle>
            <CardDescription>
              {attendanceMethod === "qr" && "Point your camera at the classroom QR code"}
              {attendanceMethod === "proximity" && "Connecting to classroom network..."}
              {attendanceMethod === "face" && "Look at the camera for face recognition"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">{currentClass.subject}</p>
              <p className="text-sm text-muted-foreground">
                {currentClass.room} • {currentClass.time}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsScanning(false)
                setAttendanceMethod(null)
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (attendanceStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
              {attendanceStatus === "success" ? (
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
              )}
            </div>
            <CardTitle>{attendanceStatus === "success" ? "Attendance Marked!" : "Attendance Failed"}</CardTitle>
            <CardDescription>
              {attendanceStatus === "success"
                ? "Your attendance has been successfully recorded"
                : "Unable to mark attendance. Please try again or contact your instructor."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {attendanceStatus === "success" && (
              <div className="text-center space-y-2 p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">{currentClass.subject}</p>
                <p className="text-sm text-green-600">
                  {currentClass.room} • {new Date().toLocaleTimeString()}
                </p>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Present
                </Badge>
              </div>
            )}
            <Button
              onClick={() => {
                setAttendanceStatus(null)
                setAttendanceMethod(null)
              }}
              className="w-full"
            >
              {attendanceStatus === "success" ? "Continue" : "Try Again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/student/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Attendance Tracker</h1>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Current Class Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{currentClass.subject}</h3>
                  <p className="text-muted-foreground">{currentClass.instructor}</p>
                </div>
                <Badge variant="secondary">In Progress</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {currentClass.room}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentClass.time}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Your Attendance</CardTitle>
            <CardDescription>Choose your preferred method to mark attendance for the current class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 bg-transparent hover:bg-primary/5"
                onClick={() => handleAttendance("qr")}
              >
                <QrCode className="h-6 w-6" />
                <span className="text-sm">QR Code</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 bg-transparent hover:bg-primary/5"
                onClick={() => handleAttendance("proximity")}
              >
                <Wifi className="h-6 w-6" />
                <span className="text-sm">Proximity</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 bg-transparent hover:bg-primary/5"
                onClick={() => handleAttendance("face")}
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm">Face Recognition</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{weeklyStats.percentage}%</span>
                  <Badge variant="secondary">
                    {weeklyStats.present}/{weeklyStats.total} classes
                  </Badge>
                </div>
                <Progress value={weeklyStats.percentage} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Present: {weeklyStats.present}</span>
                  <span>Absent: {weeklyStats.absent}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Most Used Method</span>
                  <Badge variant="outline">QR Code</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perfect Attendance Days</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-semibold text-green-600">5 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your attendance history for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground w-20">{record.date}</div>
                    <div>
                      <div className="font-medium">{record.subject}</div>
                      <div className="text-sm text-muted-foreground">{record.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={record.status === "present" ? "default" : "destructive"}
                      className={
                        record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {record.status === "present" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {record.status}
                    </Badge>
                    {record.method !== "-" && (
                      <Badge variant="outline" className="text-xs">
                        {record.method}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
