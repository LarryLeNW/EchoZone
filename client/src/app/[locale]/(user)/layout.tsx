import type { ReactNode } from "react"
import { Header } from "@/components/header"

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />
            {children}
        </div>
    )
}
