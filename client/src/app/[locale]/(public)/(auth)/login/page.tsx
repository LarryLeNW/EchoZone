import { AuthCard } from "@/components/auth/auth-card";

export default function AuthPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #3730a3 50%, #581c87 75%, #312e81 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <AuthCard />
    </div>
  )
}
