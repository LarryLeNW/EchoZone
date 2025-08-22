"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { MessageCircle, Search, Phone, Video, Minus, X, Send, Smile, Paperclip, Settings } from "lucide-react"

interface ChatWindow {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  isMinimized: boolean
  messages: Array<{
    id: string
    sender: string
    content: string
    time: string
    isMe: boolean
  }>
}

interface Contact {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen?: string
}

export function FacebookChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [openChats, setOpenChats] = useState<ChatWindow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState<{ [key: string]: string }>({})

  const contacts: Contact[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/young-asian-person.png",
      isOnline: true,
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/thoughtful-man.png",
      isOnline: true,
    },
    {
      id: "3",
      name: "Emma Wilson",
      avatar: "/blonde-woman-portrait.png",
      isOnline: false,
      lastSeen: "5 phút trước",
    },
    {
      id: "4",
      name: "David Rodriguez",
      avatar: "/man-with-detailed-beard.png",
      isOnline: true,
    },
    {
      id: "5",
      name: "Lisa Park",
      avatar: "/serene-asian-woman.png",
      isOnline: false,
      lastSeen: "1 giờ trước",
    },
  ]

  const openChat = (contact: Contact) => {
    const existingChat = openChats.find((chat) => chat.id === contact.id)
    if (existingChat) {
      setOpenChats((prev) => prev.map((chat) => (chat.id === contact.id ? { ...chat, isMinimized: false } : chat)))
      return
    }

    const newChat: ChatWindow = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      isOnline: contact.isOnline,
      isMinimized: false,
      messages: [
        {
          id: "1",
          sender: contact.name,
          content: "Chào bạn! Bạn có khỏe không?",
          time: "14:30",
          isMe: false,
        },
        {
          id: "2",
          sender: "Tôi",
          content: "Chào! Tôi khỏe, cảm ơn bạn!",
          time: "14:32",
          isMe: true,
        },
      ],
    }

    setOpenChats((prev) => [...prev, newChat])
  }

  const closeChat = (chatId: string) => {
    setOpenChats((prev) => prev.filter((chat) => chat.id !== chatId))
  }

  const minimizeChat = (chatId: string) => {
    setOpenChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, isMinimized: !chat.isMinimized } : chat)),
    )
  }

  const sendMessage = (chatId: string) => {
    const message = newMessage[chatId]
    if (!message?.trim()) return

    setOpenChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: Date.now().toString(),
                sender: "Tôi",
                content: message,
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                isMe: true,
              },
            ],
          }
        }
        return chat
      }),
    )

    setNewMessage((prev) => ({ ...prev, [chatId]: "" }))
  }

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 z-40 bg-white dark:bg-gray-800 shadow-2xl border-purple-200 dark:border-purple-700">
          <CardHeader className="pb-2 border-b border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300">Chat</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm bạn bè..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-100 dark:bg-gray-700 border-none"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 h-full overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                Đang hoạt động ({contacts.filter((c) => c.isOnline).length})
              </div>
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => openChat(contact)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{contact.name}</p>
                    {contact.isOnline ? (
                      <p className="text-xs text-green-600 dark:text-green-400">Đang hoạt động</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.lastSeen}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {openChats.map((chat, index) => (
        <Card
          key={chat.id}
          className={`fixed bottom-4 z-30 w-80 bg-white dark:bg-gray-800 shadow-2xl border-purple-200 dark:border-purple-700 transition-all duration-300 ${chat.isMinimized ? "h-12" : "h-96"
            }`}
          style={{
            right: `${100 + index * 320}px`,
          }}
        >
          <CardHeader
            className="pb-2 border-b border-purple-100 dark:border-purple-800 cursor-pointer"
            onClick={() => minimizeChat(chat.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{chat.name}</h4>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {chat.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4 text-purple-600" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4 text-purple-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => minimizeChat(chat.id)}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => closeChat(chat.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!chat.isMinimized && (
            <>
              <CardContent className="flex-1 p-3 overflow-y-auto max-h-64">
                <div className="space-y-3">
                  {chat.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${message.isMe
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${message.isMe ? "text-purple-200" : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="p-3 border-t border-purple-100 dark:border-purple-800">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4 text-purple-600" />
                  </Button>
                  <Input
                    placeholder="Aa"
                    value={newMessage[chat.id] || ""}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, [chat.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(chat.id)}
                    className="flex-1 border-none bg-gray-100 dark:bg-gray-700 rounded-full"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4 text-purple-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => sendMessage(chat.id)}
                    disabled={!newMessage[chat.id]?.trim()}
                  >
                    <Send className="w-4 h-4 text-purple-600" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      ))}
    </>
  )
}
