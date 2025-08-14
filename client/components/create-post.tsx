"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Smile, MapPin } from "lucide-react"

export function CreatePost() {
  const [content, setContent] = useState("")

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="w-10 h-10 border-2 border-purple-300 dark:border-purple-600">
            <AvatarImage src="/diverse-profile-avatars.png" />
            <AvatarFallback className="bg-purple-600 text-white">U</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Bạn đang nghĩ gì?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500 bg-purple-50/50 dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder:text-gray-400 resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Ảnh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <Smile className="w-5 h-5 mr-2" />
                  Cảm xúc
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Vị trí
                </Button>
              </div>

              <Button
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                disabled={!content.trim()}
              >
                Đăng bài
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
