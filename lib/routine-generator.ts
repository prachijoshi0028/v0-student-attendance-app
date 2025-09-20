import type { Student } from "./auth"
import { taskRecommendationEngine, type TaskRecommendation } from "./task-recommendations"

export interface ScheduleItem {
  id: string
  time: string
  endTime: string
  title: string
  type: "class" | "break" | "task" | "goal" | "free"
  subject?: string
  room?: string
  description?: string
  priority?: "high" | "medium" | "low"
  isOptional?: boolean
  estimatedDuration?: number
}

export interface DailyRoutine {
  date: string
  schedule: ScheduleItem[]
  totalStudyTime: number
  totalFreeTime: number
  goalProgress: {
    completed: number
    total: number
  }
  recommendations: TaskRecommendation[]
}

export class RoutineGenerator {
  private baseSchedule: ScheduleItem[] = [
    {
      id: "class-1",
      time: "09:00",
      endTime: "10:00",
      title: "Mathematics",
      type: "class",
      subject: "Mathematics",
      room: "Room 101",
      description: "Algebra and Linear Equations",
    },
    {
      id: "class-2",
      time: "10:00",
      endTime: "11:00",
      title: "Physics",
      type: "class",
      subject: "Physics",
      room: "Room 203",
      description: "Mechanics and Motion",
    },
    {
      id: "break-1",
      time: "11:00",
      endTime: "11:15",
      title: "Break",
      type: "break",
      description: "Short break between classes",
    },
    {
      id: "free-1",
      time: "11:15",
      endTime: "12:00",
      title: "Free Period",
      type: "free",
      description: "Available for study or personal tasks",
      estimatedDuration: 45,
    },
    {
      id: "class-3",
      time: "12:00",
      endTime: "13:00",
      title: "Computer Science",
      type: "class",
      subject: "Computer Science",
      room: "Lab 1",
      description: "Programming and Data Structures",
    },
    {
      id: "lunch",
      time: "13:00",
      endTime: "14:00",
      title: "Lunch Break",
      type: "break",
      room: "Cafeteria",
      description: "Lunch and social time",
    },
    {
      id: "class-4",
      time: "14:00",
      endTime: "15:00",
      title: "English",
      type: "class",
      subject: "English",
      room: "Room 105",
      description: "Literature and Writing",
    },
    {
      id: "free-2",
      time: "15:00",
      endTime: "16:00",
      title: "Study Time",
      type: "free",
      description: "Dedicated study period",
      estimatedDuration: 60,
    },
  ]

  private generateGoalTasks(student: Student): ScheduleItem[] {
    const goalTasks: ScheduleItem[] = []

    // Generate long-term goal activities
    student.careerGoals.forEach((goal, index) => {
      if (goal === "Software Engineer") {
        goalTasks.push({
          id: `goal-${index}`,
          time: "16:00",
          endTime: "16:30",
          title: "Career Development - Programming Practice",
          type: "goal",
          description: `Work on programming skills to achieve your goal: ${goal}`,
          priority: "medium",
          isOptional: true,
          estimatedDuration: 30,
        })
      } else if (goal === "Data Scientist") {
        goalTasks.push({
          id: `goal-${index}`,
          time: "16:30",
          endTime: "17:00",
          title: "Career Development - Data Analysis",
          type: "goal",
          description: `Practice data analysis skills for your goal: ${goal}`,
          priority: "medium",
          isOptional: true,
          estimatedDuration: 30,
        })
      }
    })

    return goalTasks
  }

  private insertTasksIntoFreeTime(
    schedule: ScheduleItem[],
    tasks: TaskRecommendation[],
    student: Student,
  ): ScheduleItem[] {
    const updatedSchedule = [...schedule]
    let taskIndex = 0

    // Find free periods and insert appropriate tasks
    for (let i = 0; i < updatedSchedule.length; i++) {
      const item = updatedSchedule[i]

      if (item.type === "free" && item.estimatedDuration && taskIndex < tasks.length) {
        const availableTime = item.estimatedDuration
        const suitableTasks = tasks.slice(taskIndex).filter((task) => task.duration <= availableTime)

        if (suitableTasks.length > 0) {
          const selectedTask = suitableTasks[0]
          const startTime = item.time
          const endTime = this.addMinutesToTime(startTime, selectedTask.duration)

          // Insert the task
          updatedSchedule.splice(i + 1, 0, {
            id: `task-${selectedTask.id}`,
            time: startTime,
            endTime: endTime,
            title: selectedTask.title,
            type: "task",
            subject: selectedTask.subject,
            description: selectedTask.description,
            priority: selectedTask.priority,
            isOptional: false,
            estimatedDuration: selectedTask.duration,
          })

          // Update the free time slot
          const remainingTime = availableTime - selectedTask.duration
          if (remainingTime > 10) {
            // Keep some free time if more than 10 minutes remain
            updatedSchedule[i] = {
              ...item,
              time: endTime,
              endTime: item.endTime,
              estimatedDuration: remainingTime,
            }
          } else {
            // Remove the free time slot if too little time remains
            updatedSchedule.splice(i, 1)
            i-- // Adjust index since we removed an item
          }

          taskIndex++
        }
      }
    }

    return updatedSchedule
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`
  }

  private calculateStudyTime(schedule: ScheduleItem[]): number {
    return schedule
      .filter((item) => item.type === "task" || item.type === "goal")
      .reduce((total, item) => total + (item.estimatedDuration || 0), 0)
  }

  private calculateFreeTime(schedule: ScheduleItem[]): number {
    return schedule
      .filter((item) => item.type === "free")
      .reduce((total, item) => total + (item.estimatedDuration || 0), 0)
  }

  public generateDailyRoutine(student: Student, date: Date = new Date()): DailyRoutine {
    // Start with base schedule
    let schedule = [...this.baseSchedule]

    // Get personalized task recommendations
    const recommendations = taskRecommendationEngine.getRecommendations(student, 8)
    const priorityTasks = recommendations.filter((task) => task.priority === "high").slice(0, 3)

    // Insert high-priority tasks into free time
    schedule = this.insertTasksIntoFreeTime(schedule, priorityTasks, student)

    // Add goal-oriented activities
    const goalTasks = this.generateGoalTasks(student)
    schedule = [...schedule, ...goalTasks]

    // Sort schedule by time
    schedule.sort((a, b) => a.time.localeCompare(b.time))

    // Calculate metrics
    const totalStudyTime = this.calculateStudyTime(schedule)
    const totalFreeTime = this.calculateFreeTime(schedule)
    const goalProgress = {
      completed: Math.floor(Math.random() * 3), // Mock completed goals
      total: goalTasks.length,
    }

    return {
      date: date.toISOString().split("T")[0],
      schedule,
      totalStudyTime,
      totalFreeTime,
      goalProgress,
      recommendations,
    }
  }

  public generateWeeklyRoutine(student: Student): DailyRoutine[] {
    const routines: DailyRoutine[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      routines.push(this.generateDailyRoutine(student, date))
    }

    return routines
  }

  public optimizeRoutineForGoals(student: Student, routine: DailyRoutine): DailyRoutine {
    // Prioritize tasks that align with career goals
    const goalAlignedTasks = routine.recommendations.filter((task) => {
      return student.careerGoals.some((goal) => {
        const careerKeywords = {
          "Software Engineer": ["Computer Science", "Programming"],
          "Data Scientist": ["Mathematics", "Statistics"],
          Doctor: ["Biology", "Chemistry"],
          Researcher: ["Research", "Analysis"],
        }
        const keywords = careerKeywords[goal as keyof typeof careerKeywords] || []
        return keywords.some((keyword) => task.title.includes(keyword) || task.subject.includes(keyword))
      })
    })

    // Re-generate schedule with goal-aligned tasks prioritized
    let optimizedSchedule = [...this.baseSchedule]
    optimizedSchedule = this.insertTasksIntoFreeTime(optimizedSchedule, goalAlignedTasks, student)

    return {
      ...routine,
      schedule: optimizedSchedule.sort((a, b) => a.time.localeCompare(b.time)),
      totalStudyTime: this.calculateStudyTime(optimizedSchedule),
      totalFreeTime: this.calculateFreeTime(optimizedSchedule),
    }
  }
}

// Export singleton instance
export const routineGenerator = new RoutineGenerator()
