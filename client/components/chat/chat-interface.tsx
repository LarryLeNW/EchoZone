"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Send,
  Phone,
  Video,
  Info,
  Smile,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Link,
  FileText,
  ImageIcon as ImageLucide,
  Shield,
  Bell,
  MessageSquare,
  Clock,
  Eye,
  Lock,
  Slash,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isOwn: boolean
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Thực tập IT - CNTT Đà Nẵng",
    avatar: "/professional-headshot.png",
    lastMessage: "Trung: 49m",
    timestamp: "49m",
    unread: 0,
    online: true,
  },
  {
    id: "2",
    name: "Đoạn chat chung",
    avatar: "/young-asian-person.png",
    lastMessage: "Yến sent a photo • 54m",
    timestamp: "54m",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "di đây ner 🤔",
    avatar: "/placeholder-573u4.png",
    lastMessage: "Làm có task cho zuii • 2h",
    timestamp: "2h",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Hoài An",
    avatar: "/placeholder-8svwp.png",
    lastMessage: "Ko thấy lệ • 3h",
    timestamp: "3h",
    unread: 1,
    online: false,
  },
  {
    id: "5",
    name: "Tuyển dụng NodeJS/ReactJS VietNam",
    avatar: "/mobile-app-mockup.png",
    lastMessage: "Khánh Ly sent a photo • 4h",
    timestamp: "4h",
    unread: 1,
    online: false,
  },
  {
    id: "6",
    name: "Tuyển dụng IT Jobs Việt Nam",
    avatar: "/diverse-woman-portrait.png",
    lastMessage: "Khánh Ly sent a photo • 4h",
    timestamp: "4h",
    unread: 1,
    online: false,
  },
  {
    id: "7",
    name: "Richard van Es",
    avatar: "/thoughtful-man.png",
    lastMessage: "You ❤️ • 20h",
    timestamp: "20h",
    unread: 0,
    online: false,
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "di đây ner",
    content: "Ủa",
    timestamp: "18:46",
    isOwn: false,
  },
  {
    id: "2",
    sender: "di đây ner",
    content: "😂😂😂",
    timestamp: "18:46",
    isOwn: false,
  },
  {
    id: "3",
    sender: "di đây ner",
    content: "Gi bỏ chơi",
    timestamp: "18:46",
    isOwn: false,
  },
  {
    id: "4",
    sender: "di đây ner",
    content: "Răng lm cho anh có đc",
    timestamp: "18:46",
    isOwn: false,
  },
  {
    id: "5",
    sender: "di đây ner",
    content: "Làm có task cho zuii 😊",
    timestamp: "18:46",
    isOwn: false,
  },
]

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[2]) // "di đây ner" chat
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showChatInfo, setShowChatInfo] = useState(true)
  const [activeTab, setActiveTab] = useState("All")
  const [expandedSections, setExpandedSections] = useState({
    pinnedMessages: true,
    customise: false,
    mediaFiles: true,
    privacy: true,
  })

  const tabs = ["All", "Unread", "Groups", "Communities"]
  const filteredChats = mockChats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chats</h1>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search Messenger"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-100 dark:bg-gray-700 border-none rounded-full"
            />
          </div>

          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`text-sm px-3 py-1 rounded-full ${
                  activeTab === tab
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {tab}
                {tab === "Groups" && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                selectedChat?.id === chat.id ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                    <AvatarFallback>
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                  {chat.id === "1" && (
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">❤️</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">{chat.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{chat.unread}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedChat ? (
        <div className={`flex-1 flex flex-col bg-white dark:bg-gray-900 ${showChatInfo ? "" : ""}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChat.avatar || "/placeholder.svg"} alt={selectedChat.name} />
                    <AvatarFallback>
                      {selectedChat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedChat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{selectedChat.name} 🤔</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat.online ? "Active now" : "Last seen 1h ago"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <Phone className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <Video className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatInfo(!showChatInfo)}
                  className={`text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 ${
                    showChatInfo ? "bg-purple-50 dark:bg-purple-900/20" : ""
                  }`}
                >
                  <Info className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {mockMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                {!message.isOwn && (
                  <Avatar className="w-7 h-7 mr-2 mt-1">
                    <AvatarImage src={selectedChat.avatar || "/placeholder.svg"} alt={message.sender} />
                    <AvatarFallback className="text-xs">
                      {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${
                    message.isOwn
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            <div className="text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">18:46</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Aa"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="rounded-full bg-gray-100 dark:bg-gray-700 border-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-8 h-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a conversation</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </div>
      )}
      {showChatInfo && selectedChat && (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Đoạn chat chung</h2>

            <div className="flex justify-center space-x-6 mb-4">
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 mb-2"
                >
                  <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400">Invite</p>
              </div>
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 mb-2"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400">Mute</p>
              </div>
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 mb-2"
                >
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400">Search</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => toggleSection("pinnedMessages")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">Chat Info</span>
                {expandedSections.pinnedMessages ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </Button>

              {expandedSections.pinnedMessages && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Go to Thực tập IT Đà Nẵng - Việc làm CNTT Đà Nẵng
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Sidechats (7)</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Link className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Copy link</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Invite community members to join this chat
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => toggleSection("customise")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">Chat members (2.3K)</span>
                {expandedSections.customise ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => toggleSection("mediaFiles")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">Media, files and links</span>
                {expandedSections.mediaFiles ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </Button>

              {expandedSections.mediaFiles && (
                <div className="px-4 pb-4">
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <ImageLucide className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Media</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Files</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Link className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Links</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection("privacy")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">Privacy and support</span>
                {expandedSections.privacy ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </Button>

              {expandedSections.privacy && (
                <div className="px-4 pb-4 space-y-1">
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">Mute notifications</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">Message permissions</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">Disappearing Messages</span>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">Read receipts</span>
                    </div>
                    <span className="text-xs text-gray-500">Off</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">Verify end-to-end encryption</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Slash className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">Restrict</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gray-800 dark:bg-white rounded-full flex items-center justify-center">
                      <Slash className="w-3 h-3 text-white dark:text-gray-800" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">Block</span>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer p-2">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">Report</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-10">
                      Give feedback and report the conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
