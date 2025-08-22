import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  TrendingUp,
  Users,
  Calendar,
  Bookmark,
  Clock,
  MapPin,
  ShoppingBag,
  Gamepad2,
  Video,
  Heart,
  Star,
} from "lucide-react"

const trendingTopics = [
  { tag: "#DigitalArt", posts: "12.5K bài viết" },
  { tag: "#CoffeeLovers", posts: "8.2K bài viết" },
  { tag: "#TechTrends", posts: "15.7K bài viết" },
  { tag: "#Photography", posts: "22.1K bài viết" },
  { tag: "#Creativity", posts: "9.8K bài viết" },
]

const quickAccess = [
  { icon: Users, label: "Bạn bè", count: "1.2K", color: "text-blue-600 dark:text-blue-400" },
  { icon: Users, label: "Nhóm", count: "24", color: "text-green-600 dark:text-green-400" },
  { icon: Calendar, label: "Sự kiện", count: "3", color: "text-red-600 dark:text-red-400" },
  { icon: Bookmark, label: "Đã lưu", count: "156", color: "text-purple-600 dark:text-purple-400" },
  { icon: Clock, label: "Kỷ niệm", count: "2", color: "text-orange-600 dark:text-orange-400" },
  { icon: MapPin, label: "Địa điểm", count: "", color: "text-pink-600 dark:text-pink-400" },
]

const entertainment = [
  { icon: Video, label: "Watch", color: "text-blue-600 dark:text-blue-400" },
  { icon: Gamepad2, label: "Gaming", color: "text-green-600 dark:text-green-400" },
  { icon: ShoppingBag, label: "Marketplace", color: "text-orange-600 dark:text-orange-400" },
]

const recentActivity = [
  { user: "Mai Anh", action: "đã thích bài viết của bạn", time: "2 phút" },
  { user: "Tuấn Minh", action: "đã bình luận", time: "5 phút" },
  { user: "Linh Chi", action: "đã chia sẻ bài viết", time: "10 phút" },
]

export function TrendingTopics() {
  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <Star className="w-5 h-5" />
            <span>Truy cập nhanh</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickAccess.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  {item.label}
                </span>
              </div>
              {item.count && (
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <Gamepad2 className="w-5 h-5" />
            <span>Giải trí</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {entertainment.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors group"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {item.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <Heart className="w-5 h-5" />
            <span>Hoạt động gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-purple-700 dark:text-purple-400">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time} trước</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <TrendingUp className="w-5 h-5" />
            <span>Xu hướng</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors group"
            >
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-purple-700 dark:text-purple-400 group-hover:text-purple-800 dark:group-hover:text-purple-300">
                  {topic.tag}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{topic.posts}</span>
              </div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
