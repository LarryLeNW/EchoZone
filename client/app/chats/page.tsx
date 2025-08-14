import { Header } from "@/components/header"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatsPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <Header />

      <div className="h-[calc(100vh-4rem)] overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  )
}
