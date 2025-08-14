import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SocialSphere
          </h1>
          <p className="text-gray-600 mt-2">Tham gia cộng đồng của chúng tôi</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h2>
            <p className="text-gray-600">Tạo tài khoản mới để bắt đầu</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
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
