"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void
  onBackToSignIn: () => void
  isLoading: boolean
}

export function ForgotPasswordForm({ onSubmit, onBackToSignIn, isLoading }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-white">Check your email</h1>
              <p className="text-white/70 text-sm leading-relaxed">
                We've sent a password reset link to <br />
                <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                onClick={onBackToSignIn}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-14 text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              >
                Back to Sign In
              </Button>

              <p className="text-white/50 text-xs text-center">
                Didn't receive the email? Check your spam folder or{" "}
                <button onClick={() => setIsSubmitted(false)} className="text-white/70 hover:text-white underline">
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
        <div className="flex items-center mb-8">
          <button
            onClick={onBackToSignIn}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/40 transition-all duration-200 hover:scale-110 mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
        </div>

        <div className="space-y-6">
          <p className="text-white/70 text-sm leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="reset-email" className="text-white font-medium flex items-center gap-2 text-base">
                <Mail className="w-4 h-4 text-white/60" />
                Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-14 text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending reset link...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-white/50 text-sm">
              Remember your password?{" "}
              <button onClick={onBackToSignIn} className="text-white/70 hover:text-white underline font-medium">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
