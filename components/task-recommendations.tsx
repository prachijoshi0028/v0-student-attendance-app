"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BookOpen, Clock, Target, TrendingUp, Play, CheckCircle, Star, Filter } from "lucide-react"
import { getCurrentUser, type Student } from "@/lib/auth"
import { taskRecommendationEngine, type TaskRecommendation } from "@/lib/task-recommendations"

export function TaskRecommendations() {
  const [user, setUser] = useState<Student | null>(null)
  const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([])
  const [freeTimeRecommendations, setFreeTimeRecommendations] = useState<TaskRecommendation[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")

  useEffect(() => {
    const currentUser = getCurrentUser() as Student
    setUser(currentUser)

    if (currentUser) {
      // Get general recommendations
      const allRecommendations = taskRecommendationEngine.getRecommendations(currentUser, 10)
      setRecommendations(allRecommendations)

      // Get free time recommendations (assuming 45 minutes available)
      const freeTimeRecs = taskRecommendationEngine.getRecommendationsForFreeTime(currentUser, 45, 5)
      setFreeTimeRecommendations(freeTimeRecs)
    }
  }, [])

  const handleCompleteTask = (taskId: string) => {
    setCompletedTasks((prev) => [...prev, taskId])
  }

  const handleStartTask = (taskId: string) => {
    // In a real app, this would navigate to the task or start a timer
    console.log(`Starting task: ${taskId}`)
  }

  const filteredRecommendations = recommendations.filter((rec) => {
    const subjectMatch = selectedSubject === "all" || rec.subject === selectedSubject
    const priorityMatch = selectedPriority === "all" || rec.priority === selectedPriority
    return subjectMatch && priorityMatch
  })

  const subjects = Array.from(new Set(recommendations.map((rec) => rec.subject)))

  if (!user) return <div>Loading...</div>

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
            <h1 className="text-xl font-semibold">Personalized Tasks</h1>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold">Your Personalized Learning Tasks</h2>
          <p className="text-muted-foreground">
            AI-powered recommendations based on your interests, strengths, and goals
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Tasks</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Target className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {recommendations.filter((r) => r.priority === "high").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Score</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(recommendations.reduce((acc, r) => acc + r.matchScore, 0) / recommendations.length)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recommended" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="free-time">Free Time</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Recommendations for You
                </CardTitle>
                <CardDescription>Tasks selected based on your profile and learning goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.slice(0, 5).map((task, index) => (
                    <div key={task.id} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {task.subject}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.duration} mins
                            </div>
                            <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                              {task.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{task.matchScore}%</span>
                          </div>
                          <div className="flex gap-2">
                            {completedTasks.includes(task.id) ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleCompleteTask(task.id)}>
                                  Mark Done
                                </Button>
                                <Button size="sm" onClick={() => handleStartTask(task.id)}>
                                  <Play className="h-3 w-3 mr-1" />
                                  Start
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded text-sm">
                        <strong>Why this task?</strong> {task.adaptiveReason}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="free-time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Perfect for Free Time
                </CardTitle>
                <CardDescription>Quick tasks you can complete during your free periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freeTimeRecommendations.map((task, index) => (
                    <div key={task.id} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {task.subject}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.duration} mins
                            </div>
                            <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{task.matchScore}%</span>
                          </div>
                          <Button size="sm" onClick={() => handleStartTask(task.id)}>
                            <Play className="h-3 w-3 mr-1" />
                            Start Now
                          </Button>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <strong>Perfect timing!</strong> This task fits your current free period and{" "}
                        {task.adaptiveReason.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Available Tasks</CardTitle>
                <CardDescription>Complete task library with filtering options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecommendations.map((task, index) => (
                    <div key={task.id} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {task.subject}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.duration} mins
                            </div>
                            <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                              {task.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{task.matchScore}%</span>
                          </div>
                          <Button size="sm" onClick={() => handleStartTask(task.id)}>
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        </div>
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
