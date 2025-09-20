"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"student" | "staff">("student")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem("userType", userType)
      // Redirect based on user type
      if (userType === "student") {
        window.location.href = "/student/dashboard"
      } else {
        window.location.href = "/staff/dashboard"
      }
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Choose your role and enter your credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={userType} onValueChange={(value) => setUserType(value as "student" | "staff")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input id="student-id" placeholder="Enter your student ID" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password">Password</Label>
                <Input id="student-password" type="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Student"}
              </Button>
            </form>
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Demo: Use any credentials to continue
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email</Label>
                <Input id="staff-email" type="email" placeholder="Enter your email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-password">Password</Label>
                <Input id="staff-password" type="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Staff"}
              </Button>
            </form>
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Demo: Use any credentials to continue
              </Badge>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
