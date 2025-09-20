// Mock authentication utilities for the prototype
export interface User {
  id: string
  name: string
  email?: string
  studentId?: string
  role: "student" | "staff"
  avatar?: string
  class?: string
  department?: string
}

export interface Student extends User {
  role: "student"
  studentId: string
  class: string
  year: number
  interests: string[]
  strengths: string[]
  careerGoals: string[]
}

export interface Staff extends User {
  role: "staff"
  department: string
  subjects: string[]
}

// Mock data for prototype
export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    studentId: "ST001",
    role: "student",
    class: "10A",
    year: 2024,
    interests: ["Mathematics", "Computer Science", "Physics"],
    strengths: ["Problem Solving", "Analytical Thinking"],
    careerGoals: ["Software Engineer", "Data Scientist"],
  },
  {
    id: "2",
    name: "Sarah Chen",
    studentId: "ST002",
    role: "student",
    class: "10A",
    year: 2024,
    interests: ["Biology", "Chemistry", "Medicine"],
    strengths: ["Research", "Critical Thinking"],
    careerGoals: ["Doctor", "Researcher"],
  },
]

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Dr. Emily Wilson",
    email: "emily.wilson@school.edu",
    role: "staff",
    department: "Mathematics",
    subjects: ["Algebra", "Calculus", "Statistics"],
  },
  {
    id: "2",
    name: "Prof. Michael Brown",
    email: "michael.brown@school.edu",
    role: "staff",
    department: "Computer Science",
    subjects: ["Programming", "Data Structures", "AI"],
  },
]

export function getCurrentUser(): User | null {
  // In a real app, this would check authentication state
  // For prototype, return mock data
  if (typeof window !== "undefined") {
    const userType = localStorage.getItem("userType")
    if (userType === "student") {
      return mockStudents[0]
    } else if (userType === "staff") {
      return mockStaff[0]
    }
  }
  return null
}

export function setUserType(type: "student" | "staff") {
  if (typeof window !== "undefined") {
    localStorage.setItem("userType", type)
  }
}
