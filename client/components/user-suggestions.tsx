import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus } from "lucide-react"

const suggestedUsers = [
  {
    name: "Emma Wilson",
    username: "@emmawilson",
    avatar: "/blonde-woman-smile.png",
    mutualFriends: 5,
  },
  {
    name: "James Rodriguez",
    username: "@jamesrod",
    avatar: "/hispanic-man-casual.png",
    mutualFriends: 3,
  },
  {
    name: "Sophie Chen",
    username: "@sophiechen",
    avatar: "/asian-woman-professional.png",
    mutualFriends: 8,
  },
]

export function UserSuggestions() {
  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
          <UserPlus className="w-5 h-5" />
          <span>Gợi ý kết bạn</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-purple-300 dark:border-purple-600">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-purple-600 text-white">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.mutualFriends} bạn chung</p>
              </div>
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              Kết bạn
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
