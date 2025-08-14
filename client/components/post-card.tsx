"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share, MoreHorizontal, Send } from "lucide-react"
import Image from "next/image"

interface Comment {
  id: number
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
}

interface Post {
  id: number
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
}

interface PostCardProps {
  post: Post
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    user: {
      name: "Emma Wilson",
      username: "@emmawilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "This looks amazing! 😍",
    timestamp: "2h",
    likes: 5,
  },
  {
    id: 2,
    user: {
      name: "David Kim",
      username: "@davidkim",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "Great work! Keep it up 👏",
    timestamp: "1h",
    likes: 3,
  },
]

// Mock user ID mapping - in real app this would come from API
const getUserId = (username: string) => {
  const userMap: { [key: string]: string } = {
    "@sarahchen": "1",
    "@alexrivera": "2",
    "@mikejohnson": "3",
  }
  return userMap[username] || "1"
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const router = useRouter()

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleCommentToggle = () => {
    setShowComments(!showComments)
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: {
          name: "You",
          username: "@you",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        content: newComment,
        timestamp: "now",
        likes: 0,
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const handleUserClick = () => {
    const userId = getUserId(post.user.username)
    router.push(`/profile/${userId}`)
  }

  return (
    <Card className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleUserClick}
          >
            <Avatar className="w-10 h-10 border-2 border-purple-300 dark:border-purple-600">
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-purple-600 text-white">{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                {post.user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {post.user.username} • {post.timestamp}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-4 pb-3">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{post.content}</p>
        </div>

        {post.image && (
          <div className="relative">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="p-4 border-t border-purple-100 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked ? "text-red-500 hover:text-red-600" : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCommentToggle}
                className={`flex items-center space-x-2 transition-colors ${
                  showComments
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments + comments.length}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <Share className="w-5 h-5" />
                <span>{post.shares}</span>
              </Button>
            </div>
          </div>
        </div>

        {showComments && (
          <div className="border-t border-purple-100 dark:border-purple-800">
            <div className="px-4 py-3 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {comment.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{comment.user.name}</p>
                      <p className="text-gray-800 dark:text-gray-200 text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 ml-3">
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                        Like
                      </button>
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                        Reply
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-purple-600 text-white text-xs">Y</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-end space-x-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[40px] max-h-[120px] resize-none bg-gray-100 dark:bg-gray-700 border-none rounded-2xl px-3 py-2 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmitComment()
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 h-8 w-8"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
