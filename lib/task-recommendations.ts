import type { Student } from "./auth"

export interface Task {
  id: string
  title: string
  subject: string
  duration: number // in minutes
  priority: "high" | "medium" | "low"
  difficulty: "easy" | "medium" | "hard"
  type: "practice" | "review" | "project" | "reading" | "research"
  description: string
  reason: string
  resources?: string[]
  estimatedCompletion?: Date
}

export interface TaskRecommendation extends Task {
  matchScore: number // 0-100, how well it matches the student
  adaptiveReason: string
}

// Mock task database
const taskDatabase: Task[] = [
  // Mathematics Tasks
  {
    id: "math-001",
    title: "Algebra Practice Set - Linear Equations",
    subject: "Mathematics",
    duration: 30,
    priority: "high",
    difficulty: "medium",
    type: "practice",
    description: "Solve 15 linear equation problems with varying complexity",
    reason: "Strengthen problem-solving skills",
    resources: ["Algebra Workbook Ch. 3", "Khan Academy Linear Equations"],
  },
  {
    id: "math-002",
    title: "Quadratic Functions Review",
    subject: "Mathematics",
    duration: 45,
    priority: "medium",
    difficulty: "hard",
    type: "review",
    description: "Review quadratic functions, graphing, and applications",
    reason: "Prepare for upcoming test",
    resources: ["Textbook Ch. 5", "Practice Problems Set B"],
  },
  {
    id: "math-003",
    title: "Statistics Data Analysis Project",
    subject: "Mathematics",
    duration: 60,
    priority: "medium",
    difficulty: "medium",
    type: "project",
    description: "Analyze real-world data using statistical methods",
    reason: "Apply mathematical concepts to real scenarios",
    resources: ["Statistics Software", "Sample Datasets"],
  },

  // Computer Science Tasks
  {
    id: "cs-001",
    title: "Python Programming Basics",
    subject: "Computer Science",
    duration: 45,
    priority: "high",
    difficulty: "easy",
    type: "practice",
    description: "Learn Python syntax, variables, and basic operations",
    reason: "Build foundation for software engineering career",
    resources: ["Python.org Tutorial", "Codecademy Python Course"],
  },
  {
    id: "cs-002",
    title: "Data Structures - Arrays and Lists",
    subject: "Computer Science",
    duration: 50,
    priority: "high",
    difficulty: "medium",
    type: "practice",
    description: "Understand and implement arrays, lists, and their operations",
    reason: "Essential for programming interviews and software development",
    resources: ["Data Structures Textbook", "LeetCode Practice Problems"],
  },
  {
    id: "cs-003",
    title: "Web Development Project - Personal Portfolio",
    subject: "Computer Science",
    duration: 90,
    priority: "medium",
    difficulty: "medium",
    type: "project",
    description: "Create a personal portfolio website using HTML, CSS, and JavaScript",
    reason: "Practical application of web development skills",
    resources: ["MDN Web Docs", "GitHub Pages", "VS Code"],
  },

  // Physics Tasks
  {
    id: "phy-001",
    title: "Physics Formula Review - Mechanics",
    subject: "Physics",
    duration: 25,
    priority: "medium",
    difficulty: "easy",
    type: "review",
    description: "Review and memorize key mechanics formulas",
    reason: "Prepare for upcoming physics test",
    resources: ["Physics Formula Sheet", "Practice Problems"],
  },
  {
    id: "phy-002",
    title: "Lab Report - Pendulum Experiment",
    subject: "Physics",
    duration: 40,
    priority: "high",
    difficulty: "medium",
    type: "project",
    description: "Write lab report analyzing pendulum motion data",
    reason: "Develop scientific writing and analysis skills",
    resources: ["Lab Data", "Report Template", "Scientific Writing Guide"],
  },

  // General Academic Tasks
  {
    id: "gen-001",
    title: "Study Skills Workshop - Note Taking",
    subject: "Study Skills",
    duration: 30,
    priority: "low",
    difficulty: "easy",
    type: "reading",
    description: "Learn effective note-taking strategies for better learning",
    reason: "Improve overall academic performance",
    resources: ["Study Skills Guide", "Note-taking Templates"],
  },
  {
    id: "gen-002",
    title: "Career Research - Software Engineering",
    subject: "Career Development",
    duration: 35,
    priority: "medium",
    difficulty: "easy",
    type: "research",
    description: "Research software engineering career paths and requirements",
    reason: "Align studies with career goals",
    resources: ["Career Websites", "Industry Reports", "Professional Networks"],
  },
]

export class TaskRecommendationEngine {
  private calculateMatchScore(task: Task, student: Student): number {
    let score = 0

    // Subject interest match (40% weight)
    if (student.interests.includes(task.subject)) {
      score += 40
    }

    // Career goal alignment (30% weight)
    const careerKeywords = {
      "Software Engineer": ["Computer Science", "Programming", "Web Development"],
      "Data Scientist": ["Mathematics", "Statistics", "Computer Science"],
      Doctor: ["Biology", "Chemistry", "Physics"],
      Researcher: ["Mathematics", "Physics", "Biology", "Chemistry"],
    }

    for (const goal of student.careerGoals) {
      const keywords = careerKeywords[goal as keyof typeof careerKeywords] || []
      if (keywords.some((keyword) => task.title.includes(keyword) || task.subject.includes(keyword))) {
        score += 30
        break
      }
    }

    // Strength alignment (20% weight)
    const strengthKeywords = {
      "Problem Solving": ["practice", "project"],
      "Analytical Thinking": ["review", "research"],
      "Critical Thinking": ["project", "research"],
      Research: ["research", "reading"],
    }

    for (const strength of student.strengths) {
      const keywords = strengthKeywords[strength as keyof typeof strengthKeywords] || []
      if (keywords.includes(task.type)) {
        score += 20
        break
      }
    }

    // Priority boost (10% weight)
    if (task.priority === "high") score += 10
    else if (task.priority === "medium") score += 5

    return Math.min(score, 100)
  }

  private generateAdaptiveReason(task: Task, student: Student, matchScore: number): string {
    const reasons = []

    if (student.interests.includes(task.subject)) {
      reasons.push(`matches your interest in ${task.subject}`)
    }

    const careerAlignment = student.careerGoals.some((goal) => {
      const careerKeywords = {
        "Software Engineer": ["Computer Science", "Programming", "Web Development"],
        "Data Scientist": ["Mathematics", "Statistics", "Computer Science"],
        Doctor: ["Biology", "Chemistry", "Physics"],
        Researcher: ["Mathematics", "Physics", "Biology", "Chemistry"],
      }
      const keywords = careerKeywords[goal as keyof typeof careerKeywords] || []
      return keywords.some((keyword) => task.title.includes(keyword) || task.subject.includes(keyword))
    })

    if (careerAlignment) {
      const alignedGoal = student.careerGoals.find((goal) => {
        const careerKeywords = {
          "Software Engineer": ["Computer Science", "Programming", "Web Development"],
          "Data Scientist": ["Mathematics", "Statistics", "Computer Science"],
          Doctor: ["Biology", "Chemistry", "Physics"],
          Researcher: ["Mathematics", "Physics", "Biology", "Chemistry"],
        }
        const keywords = careerKeywords[goal as keyof typeof careerKeywords] || []
        return keywords.some((keyword) => task.title.includes(keyword) || task.subject.includes(keyword))
      })
      reasons.push(`aligns with your career goal: ${alignedGoal}`)
    }

    const strengthAlignment = student.strengths.some((strength) => {
      const strengthKeywords = {
        "Problem Solving": ["practice", "project"],
        "Analytical Thinking": ["review", "research"],
        "Critical Thinking": ["project", "research"],
        Research: ["research", "reading"],
      }
      const keywords = strengthKeywords[strength as keyof typeof strengthKeywords] || []
      return keywords.includes(task.type)
    })

    if (strengthAlignment) {
      const alignedStrength = student.strengths.find((strength) => {
        const strengthKeywords = {
          "Problem Solving": ["practice", "project"],
          "Analytical Thinking": ["review", "research"],
          "Critical Thinking": ["project", "research"],
          Research: ["research", "reading"],
        }
        const keywords = strengthKeywords[strength as keyof typeof strengthKeywords] || []
        return keywords.includes(task.type)
      })
      reasons.push(`leverages your strength in ${alignedStrength}`)
    }

    if (task.priority === "high") {
      reasons.push("high priority for academic success")
    }

    if (reasons.length === 0) {
      return "recommended for well-rounded academic development"
    }

    return `Recommended because it ${reasons.join(" and ")}`
  }

  public getRecommendations(
    student: Student,
    limit = 5,
    filterBySubject?: string,
    currentTime?: Date,
  ): TaskRecommendation[] {
    let filteredTasks = taskDatabase

    // Filter by subject if specified
    if (filterBySubject) {
      filteredTasks = filteredTasks.filter((task) => task.subject === filterBySubject)
    }

    // Calculate match scores and create recommendations
    const recommendations: TaskRecommendation[] = filteredTasks.map((task) => {
      const matchScore = this.calculateMatchScore(task, student)
      const adaptiveReason = this.generateAdaptiveReason(task, student, matchScore)

      return {
        ...task,
        matchScore,
        adaptiveReason,
      }
    })

    // Sort by match score (descending) and return top recommendations
    return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit)
  }

  public getRecommendationsForFreeTime(student: Student, availableMinutes: number, limit = 3): TaskRecommendation[] {
    // Filter tasks that can be completed in available time
    const suitableTasks = taskDatabase.filter((task) => task.duration <= availableMinutes)

    return this.getRecommendations(student, limit).filter((rec) => suitableTasks.some((task) => task.id === rec.id))
  }

  public getRecommendationsByPriority(student: Student, priority: "high" | "medium" | "low"): TaskRecommendation[] {
    const filteredTasks = taskDatabase.filter((task) => task.priority === priority)
    const recommendations: TaskRecommendation[] = filteredTasks.map((task) => {
      const matchScore = this.calculateMatchScore(task, student)
      const adaptiveReason = this.generateAdaptiveReason(task, student, matchScore)

      return {
        ...task,
        matchScore,
        adaptiveReason,
      }
    })

    return recommendations.sort((a, b) => b.matchScore - a.matchScore)
  }
}

// Export singleton instance
export const taskRecommendationEngine = new TaskRecommendationEngine()
