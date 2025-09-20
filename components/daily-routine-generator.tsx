"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  BookOpen,
  Coffee,
  Play,
  CheckCircle,
  TrendingUp,
  Settings,
  RefreshCw,
  Zap,
} from "lucide-react"
import { getCurrentUser, type Student } from "@/lib/auth"
import { routineGenerator, type DailyRoutine } from "@/lib/routine-generator"

export function DailyRoutineGenerator() {
  const [user, setUser] = useState<Student | null>(null)
  const [currentRoutine, setCurrentRoutine] = useState<DailyRoutine | null>(null)
  const [weeklyRoutines, setWeeklyRoutines] = useState<DailyRoutine[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [completedItems, setCompletedItems] = useState<string[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser() as Student
    setUser(currentUser)

    if (currentUser) {
      // Generate today's routine
      const todayRoutine = routineGenerator.generateDailyRoutine(currentUser)
      setCurrentRoutine(todayRoutine)
      setSelectedDate(todayRoutine.date)

      // Generate weekly routines
      const weeklyRoutines = routineGenerator.generateWeeklyRoutine(currentUser)
      setWeeklyRoutines(weeklyRoutines)
    }
  }, [])

  const handleCompleteItem = (itemId: string) => {
    setCompletedItems((prev) => [...prev, itemId])
  }

  const handleOptimizeRoutine = () => {
    if (user && currentRoutine) {
      const optimizedRoutine = routineGenerator.optimizeRoutineForGoals(user, currentRoutine)
      setCurrentRoutine(optimizedRoutine)
    }
  }

  const handleRegenerateRoutine = () => {
    if (user) {
      const newRoutine = routineGenerator.generateDailyRoutine(user)
      setCurrentRoutine(newRoutine)
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "class":
        return BookOpen
      case "break":
        return Coffee
      case "task":
        return Target
      case "goal":
        return TrendingUp
      case "free":
        return Clock
      default:
        return Clock
    }
  }

  const getItemColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-100 text-blue-800"
      case "break":
        return "bg-green-100 text-green-800"
      case "task":
        return "bg-purple-100 text-purple-800"
      case "goal":
        return "bg-orange-100 text-orange-800"
      case "free":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user || !currentRoutine) return <div>Loading...</div>

  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const currentItem = currentRoutine.schedule.find((item) => {
    return item.time <= currentTime && item.endTime > currentTime
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/student/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Daily Routine</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleOptimizeRoutine}>
              <Zap className="h-4 w-4 mr-2" />
              Optimize
            </Button>
            <Button variant="outline" size="sm" onClick={handleRegenerateRoutine}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Current Status */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Activity</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{currentItem?.title || "Free Time"}</div>
              <p className="text-xs text-muted-foreground">
                {currentItem ? `${currentItem.time} - ${currentItem.endTime}` : "No scheduled activity"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time Today</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{currentRoutine.totalStudyTime}m</div>
              <p className="text-xs text-muted-foreground">Personalized tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{currentRoutine.totalFreeTime}m</div>
              <p className="text-xs text-muted-foreground">Available for flexibility</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {currentRoutine.goalProgress.completed}/{currentRoutine.goalProgress.total}
              </div>
              <Progress
                value={(currentRoutine.goalProgress.completed / currentRoutine.goalProgress.total) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today's Routine</TabsTrigger>
            <TabsTrigger value="week">Weekly View</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Personalized Schedule
                </CardTitle>
                <CardDescription>AI-generated routine based on your classes, goals, and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRoutine.schedule.map((item, index) => {
                    const Icon = getItemIcon(item.type)
                    const isCompleted = completedItems.includes(item.id)
                    const isCurrent = currentItem?.id === item.id

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border ${isCurrent ? "ring-2 ring-primary" : ""} ${
                          isCompleted ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{item.title}</h4>
                                <Badge className={`text-xs ${getItemColor(item.type)}`}>{item.type}</Badge>
                                {item.priority && (
                                  <Badge
                                    variant={
                                      item.priority === "high"
                                        ? "destructive"
                                        : item.priority === "medium"
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {item.priority}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.time} - {item.endTime}
                                {item.room && ` • ${item.room}`}
                                {item.subject && ` • ${item.subject}`}
                              </div>
                              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCurrent && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Current
                              </Badge>
                            )}
                            {isCompleted ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Done
                              </Badge>
                            ) : (
                              item.type === "task" && (
                                <Button size="sm" variant="outline" onClick={() => handleCompleteItem(item.id)}>
                                  Mark Done
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Overview</CardTitle>
                <CardDescription>Your routine for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {weeklyRoutines.map((routine, index) => {
                    const date = new Date(routine.date)
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                    const dayNumber = date.getDate()

                    return (
                      <Card key={routine.date} className="p-4">
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-lg font-bold">{dayName}</div>
                            <div className="text-2xl font-bold text-primary">{dayNumber}</div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Study Time:</span>
                              <span className="font-medium">{routine.totalStudyTime}m</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Free Time:</span>
                              <span className="font-medium">{routine.totalFreeTime}m</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tasks:</span>
                              <span className="font-medium">
                                {routine.schedule.filter((item) => item.type === "task").length}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setCurrentRoutine(routine)}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customize" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Customize Your Routine
                </CardTitle>
                <CardDescription>Adjust preferences to personalize your daily schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Study Time</label>
                    <Select defaultValue="morning">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9-12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (1-5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6-9 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Task Duration Preference</label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (15-30 min)</SelectItem>
                        <SelectItem value="medium">Medium (30-60 min)</SelectItem>
                        <SelectItem value="long">Long (60+ min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Break Frequency</label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frequent">Every 30 minutes</SelectItem>
                        <SelectItem value="normal">Every 60 minutes</SelectItem>
                        <SelectItem value="minimal">Every 90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Goal Focus</label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic Performance</SelectItem>
                        <SelectItem value="career">Career Preparation</SelectItem>
                        <SelectItem value="balanced">Balanced Approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleRegenerateRoutine}>Apply Changes</Button>
                  <Button variant="outline">Reset to Default</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Routine Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Optimization Tip</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your routine is optimized for your career goal of becoming a Software Engineer. We've prioritized
                      Computer Science tasks during your peak focus hours.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Goal Alignment</h4>
                    <p className="text-sm text-green-700 mt-1">
                      85% of your personalized tasks align with your interests and career goals. This helps maintain
                      motivation and long-term progress.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900">Balance Score</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Your routine maintains a healthy balance with 60% structured time and 40% flexible time for
                      personal activities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
