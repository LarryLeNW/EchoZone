"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { X, Mail, Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useLoginMutation, useRegisterMutation } from "../../queries/useAuth"
import { handleErrorApi } from "@/lib/utils"
import { useRouter } from '@/../navigation'
import { LoginBody, LoginBodyType, RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema"
enum AuthMode {
  LOGIN, REGISTER
}

export function AuthCard() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<AuthMode>(AuthMode.LOGIN)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const registerMutation = useRegisterMutation()
  const loginMutation = useLoginMutation()

  const isLogin = activeTab === AuthMode.LOGIN
  const resolver = useMemo(
    () => zodResolver(isLogin ? LoginBody : RegisterBody),
    [isLogin]
  )
  const handleRedirect = () => {
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset
  } = useForm<LoginBodyType & RegisterBodyType>({
    resolver,
    shouldUnregister: true,
  })

  const onSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      if (AuthMode.REGISTER === activeTab) {
        await registerMutation.mutateAsync(values);
      } else {
        await loginMutation.mutateAsync(values);
      }
      toast.success(AuthMode.REGISTER === activeTab ? "Đăng kí thành công ..." : "Đăng nhập thành công ...")
      router.push('/')
    } catch (error) {
      handleErrorApi({
        error,
        setError
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    clearErrors()
  }, [activeTab, clearErrors])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab(AuthMode.REGISTER)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeTab === AuthMode.REGISTER
                ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              Đăng kí
            </button>
            <button
              onClick={() => setActiveTab(AuthMode.LOGIN)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeTab === AuthMode.LOGIN
                ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              Đăng nhập
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-normal text-white mb-8 transition-all duration-300">
          {activeTab === AuthMode.REGISTER ? "Tạo tài khoản" : "Chào mừng trở lại"}
        </h1>

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out transform ${activeTab === AuthMode.REGISTER
              ? "translate-x-0 opacity-100 relative z-10"
              : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none"
              }`}
          >
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {activeTab === AuthMode.REGISTER && (
                <>
                  <div className="relative">
                    <Input
                      type="text"
                      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0"
                      placeholder="Tên người dùng"
                      {...register("displayName")}
                      autoComplete="off"
                    />
                    {errors.displayName && (
                      <p className="text-red-500 text-sm mt-1 text-end">
                        {errors.displayName.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      type="email"
                      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12"
                      placeholder="Nhập email của bạn"
                      {...register("email")}
                      autoComplete="off"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 text-end">{errors.email.message}</p>
                  )}

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pr-12"
                      placeholder="Nhập mật khẩu"
                      {...register("password")}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 text-end">{errors.password.message}</p>
                  )}

                  <Button type="submit" className="w-full bg-white/20 border border-white/20 hover:bg-white/30 text-white rounded-2xl h-14 mt-8" disabled={isLoading}>
                    {isLoading ? "Vui lòng đợi một chút..." : "Đăng kí"}
                  </Button>
                </>
              )}
            </form>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out transform ${activeTab === AuthMode.LOGIN
              ? "translate-x-0 opacity-100 relative z-10"
              : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
              }`}
          >
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-hidden={activeTab !== AuthMode.LOGIN}>
              {activeTab === AuthMode.LOGIN && (
                <>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      {...register("email")}
                      type="email"
                      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 text-end">{errors.email.message}</p>
                  )}

                  <div className="relative">
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 text-end">{errors.password.message}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border border-white/20 bg-black/20 text-white focus:ring-white/20 focus:ring-2" />
                      <span className="text-white/60 text-sm">Remember me</span>
                    </label>
                    <button type="button" className="text-white/60 hover:text-white text-sm">Forgot password?</button>
                  </div>

                  <Button type="submit" className="w-full bg-white/20 border border-white/20 hover:bg-white/30 text-white rounded-2xl h-14 mt-8" disabled={isLoading}>
                    {isLoading ? "Vui lòng đợi một chút" : "Đăng nhập"}
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-white/40 text-sm font-medium">
            {activeTab === AuthMode.LOGIN ? "hoặc đăng nhập với" : "hoặc tiếp tục với"}
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleRedirect}
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 flex items-center justify-center hover:bg-black/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <div className="w-6 h-6 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </div>
          </button>
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          {activeTab === AuthMode.REGISTER
            ? "By creating an account, you agree to our Terms & Service"
            : "By signing in, you agree to our Terms & Service"}
        </p>
      </div>
    </div>
  )
}
