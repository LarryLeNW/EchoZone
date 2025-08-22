import { ForgotPasswordForm } from "../components/auth/forgot-password-form"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            SocialSphere
          </h1>
          <p className="text-gray-600 mt-2">Khôi phục tài khoản của bạn</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
            <p className="text-gray-600">Nhập email để nhận liên kết đặt lại mật khẩu</p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nhớ mật khẩu?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 SocialSphere. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  )
}
