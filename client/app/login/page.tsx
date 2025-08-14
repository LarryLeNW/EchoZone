"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AuthCard } from "@/components/auth/auth-card"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Signed in successfully!",
        description: "Welcome back to your account.",
      })
    }, 1500)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      })
    }, 1500)
  }

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} login`,
      description: `Redirecting to ${provider}...`,
    })
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handlePasswordReset = (resetEmail: string) => {
    setIsLoading(true)

    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Reset link sent",
        description: `Password reset instructions sent to ${resetEmail}`,
      })
    }, 1500)
  }

  const handleBackToSignIn = () => {
    setShowForgotPassword(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #3730a3 50%, #581c87 75%, #312e81 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {showForgotPassword ? (
        <ForgotPasswordForm onSubmit={handlePasswordReset} onBackToSignIn={handleBackToSignIn} isLoading={isLoading} />
      ) : (
        <AuthCard
          isLoading={isLoading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSocialLogin={handleSocialLogin}
          onForgotPassword={handleForgotPassword}
        />
      )}
    </div>
  )
}
