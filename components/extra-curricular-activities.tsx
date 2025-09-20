"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Plus,
  Trophy,
  Calendar,
  Clock,
  Users,
  Star,
  Award,
  Target,
  BookOpen,
  Palette,
  Zap,
} from "lucide-react"

interface Activity {
  id: string
  name: string
  category: string
  description: string
  startDate: string
  endDate?: string
  status: "ongoing" | "completed" | "upcoming"
  achievements: string[]
  hoursSpent: number
  skillsGained: string[]
  impact: string
}

export function ExtraCurricularActivities() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      name: "Science Club President",
      category: "Leadership",
      description: "Leading the school science club, organizing events and competitions",
      startDate: "2024-09-01",
      status: "ongoing",
      achievements: ["Organized 3 science fairs", "Increased membership by 40%"],
      hoursSpent: 120,
      skillsGained: ["Leadership", "Event Management", "Public Speaking"],
      impact: "Improved science engagement among students",
    },
    {
      id: "2",
      name: "Robotics Competition Team",
      category: "STEM",
      description: "Member of the school robotics team competing in regional championships",
      startDate: "2024-08-15",
      endDate: "2024-12-15",
      status: "ongoing",
      achievements: ["2nd place in regional qualifier", "Best design award"],
      hoursSpent: 80,
      skillsGained: ["Programming", "Engineering Design", "Teamwork"],
      impact: "Developed technical skills and problem-solving abilities",
    },
    {
      id: "3",
      name: "Community Service - Food Bank",
      category: "Community Service",
      description: "Volunteering at local food bank every weekend",
      startDate: "2024-06-01",
      status: "ongoing",
      achievements: ["Served 500+ families", "Volunteer of the month"],
      hoursSpent: 60,
      skillsGained: ["Empathy", "Organization", "Communication"],
      impact: "Helped address food insecurity in the community",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    name: "",
    category: "",
    description: "",
    startDate: "",
    endDate: "",
  })

  const categories = ["Leadership", "STEM", "Arts", "Sports", "Community Service", "Academic", "Other"]

  const totalHours = activities.reduce((sum, activity) => sum + activity.hoursSpent, 0)
  const completedActivities = activities.filter((a) => a.status === "completed").length
  const ongoingActivities = activities.filter((a) => a.status === "ongoing").length

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.category || !newActivity.description) return

    const activity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      category: newActivity.category,
      description: newActivity.description,
      startDate: newActivity.startDate,
      endDate: newActivity.endDate || undefined,
      status: "ongoing",
      achievements: [],
      hoursSpent: 0,
      skillsGained: [],
      impact: "",
    }

    setActivities([...activities, activity])
    setNewActivity({ name: "", category: "", description: "", startDate: "", endDate: "" })
    setShowAddForm(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Leadership":
        return <Users className="h-4 w-4" />
      case "STEM":
        return <Zap className="h-4 w-4" />
      case "Arts":
        return <Palette className="h-4 w-4" />
      case "Sports":
        return <Trophy className="h-4 w-4" />
      case "Community Service":
        return <Target className="h-4 w-4" />
      case "Academic":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800"
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
            <h1 className="text-xl font-semibold">Extra-Curricular Activities</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activities.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{ongoingActivities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedActivities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalHours}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Activity Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Activity</CardTitle>
              <CardDescription>Record your extra-curricular activities and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Activity Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Drama Club, Basketball Team"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your role and responsibilities"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newActivity.startDate}
                    onChange={(e) => setNewActivity({ ...newActivity, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newActivity.endDate}
                    onChange={(e) => setNewActivity({ ...newActivity, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddActivity}>Add Activity</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activities List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {getCategoryIcon(activity.category)}
                        {activity.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{activity.category}</Badge>
                        <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{activity.hoursSpent} hours</div>
                      <div>{activity.startDate}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{activity.description}</p>

                  {activity.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Achievements
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {activity.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activity.skillsGained.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Skills Gained</h4>
                      <div className="flex flex-wrap gap-2">
                        {activity.skillsGained.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.impact && (
                    <div>
                      <h4 className="font-medium mb-2">Impact</h4>
                      <p className="text-sm text-muted-foreground">{activity.impact}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="ongoing" className="space-y-4">
            {activities
              .filter((activity) => activity.status === "ongoing")
              .map((activity) => (
                <Card key={activity.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(activity.category)}
                      {activity.name}
                    </CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                      <span className="text-sm text-muted-foreground">{activity.hoursSpent} hours</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {activities
              .filter((activity) => activity.status === "completed")
              .map((activity) => (
                <Card key={activity.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(activity.category)}
                      {activity.name}
                    </CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                      <span className="text-sm text-muted-foreground">{activity.hoursSpent} hours</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
