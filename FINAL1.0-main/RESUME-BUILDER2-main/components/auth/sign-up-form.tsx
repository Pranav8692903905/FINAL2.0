"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User } from "lucide-react"
import { useAuth } from "./auth-context"

interface SignUpFormProps {
  onToggleMode: () => void
  onSuccess?: () => void
}

export function SignUpForm({ onToggleMode, onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const { signUp, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    const result = await signUp(email, password, name)
    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || "Sign up failed")
    }
  }

  return (
    <Card className="w-full max-w-md modern-form shadow-2xl border-secondary/20 hover:border-secondary/30 transition-all duration-300">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
          Create your account
        </CardTitle>
        <CardDescription className="text-muted-foreground">Start building professional resumes with AI</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-accent font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-accent/60" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 border-accent/20 focus:border-accent/40 focus:ring-accent/20 bg-background/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-primary/20 focus:border-primary/40 focus:ring-primary/20 bg-background/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-secondary font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-secondary/60" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border-secondary/20 focus:border-secondary/40 focus:ring-secondary/20 bg-background/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-secondary via-accent to-primary hover:from-primary hover:via-secondary hover:to-accent transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary font-medium transition-all duration-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
