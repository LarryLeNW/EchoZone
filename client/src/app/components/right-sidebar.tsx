"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Users, Calendar, Gift, MessageCircle, Phone } from "lucide-react"

const onlineFriends = [
  {
    id: 1,
    name: "Sarah Wilson",
    avatar: "/diverse-woman-portrait.png",
    isOnline: true,
    lastSeen: "Active now",
  },
  {
    id: 2,
    name: "Mike Johnson",
    avatar: "/thoughtful-man.png",
    isOnline: true,
    lastSeen: "Active 5m ago",
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "/blonde-woman-portrait.png",
    isOnline: true,
    lastSeen: "Active now",
  },
  {
    id: 4,
    name: "Tom Brown",
    avatar: "/man-with-detailed-beard.png",
    isOnline: false,
    lastSeen: "Active 2h ago",
  },
  {
    id: 5,
    name: "Lisa Chen",
    avatar: "/serene-asian-woman.png",
    isOnline: true,
    lastSeen: "Active now",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Tech Meetup 2024",
    date: "Tomorrow",
    time: "7:00 PM",
    attendees: 45,
  },
  {
    id: 2,
    title: "Coffee Chat",
    date: "Friday",
    time: "2:00 PM",
    attendees: 8,
  },
]

const birthdays = [
  {
    id: 1,
    name: "Anna Rodriguez",
    avatar: "/latina-woman.png",
  },
  {
    id: 2,
    name: "James Wilson",
    avatar: "/man-in-sharp-suit.png",
  },
]

export function RightSidebar() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <Users className="w-5 h-5" />
            <span>Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {onlineFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between group hover:bg-purple-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                    <AvatarFallback>
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {friend.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{friend.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{friend.lastSeen}</p>
                </div>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <Gift className="w-5 h-5" />
            <span>Birthdays</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {birthdays.map((person) => (
            <div
              key={person.id}
              className="flex items-center space-x-3 p-2 hover:bg-purple-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                <AvatarFallback>
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-medium">{person.name}</span> has a birthday today
                </p>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
            Write on their timeline
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <Calendar className="w-5 h-5" />
            <span>Upcoming Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-colors cursor-pointer"
            >
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{event.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {event.date} at {event.time}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">{event.attendees} going</p>
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  Interested
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full text-purple-600 dark:text-purple-400">
            See all events
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-300">
            <MessageCircle className="w-5 h-5" />
            <span>Group Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Design Team</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">5 members</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              2
            </Badge>
          </div>
          <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekend Plans</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">8 members</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
