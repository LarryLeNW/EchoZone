"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { Heart, MessageCircle, Share, MoreHorizontal, Send } from "lucide-react"
import Image from "next/image"
import { PostResponseType } from "@/schemaValidations/post.schema"

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


interface PostCardProps {
  post: PostResponseType
}

const mockComments: Comment[] = [
  {
    id: 1,
    user: { name: "Emma Wilson", username: "@emmawilson", avatar: "/placeholder.svg?height=32&width=32" },
    content: "This looks amazing! 😍",
    timestamp: "2h",
    likes: 5
  },
  {
    id: 2,
    user: { name: "David Kim", username: "@davidkim", avatar: "/placeholder.svg?height=32&width=32" },
    content: "Great work! Keep it up 👏",
    timestamp: "1h",
    likes: 3
  }
]

function parseMediaJson(mediaJson: string | null | undefined): string[] {
  if (!mediaJson) return []
  try {
    const obj = JSON.parse(mediaJson)
    const imgs = obj?.image ?? obj?.images ?? []
    return Array.isArray(imgs) ? imgs.filter((x: unknown) => typeof x === "string") : []
  } catch {
    return []
  }
}

function timeSince(iso: string): string {
  const d = new Date(iso)
  const diff = Math.max(0, Date.now() - d.getTime())
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

function ImageCollage({ images }: { images: string[] }) {
  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="relative">
        <Image src={images[0]} alt="" width={1200} height={800} className="w-full h-auto object-cover aspect-[2/2]" />
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {images.slice(0, 2).map((src, i) => (
          <div key={i} className="relative aspect-[4/3]">
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    )
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-1">
        <div className="relative col-span-2 aspect-[2/1]">
          <Image src={images[0]} alt="" fill className="object-cover" />
        </div>
        {images.slice(1, 3).map((src, i) => (
          <div key={i} className="relative aspect-[4/3]">
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    )
  }

  const remain = images.length - 4
  return (
    <div className="grid grid-cols-3 gap-1">
      <div className="relative col-span-3 aspect-[4/5] md:aspect-[2/1]">
        <Image src={images[0]} alt="" fill className="object-cover" />
      </div>
      {images.slice(1, 3).map((src, i) => (
        <div key={i} className="relative aspect-[4/3]">
          <Image src={src} alt="" fill className="object-cover" />
        </div>
      ))}
      <div className="relative  aspect-[4/3]">
        <Image src={images[4] ?? images[1]} alt="" fill className="object-cover brightness-75" />
        {remain > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-black/60 text-white text-sm font-semibold">+{remain}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const images = useMemo(() => parseMediaJson(post.mediaJson), [post.mediaJson])
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState<number>(post.reactionCount ?? 0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")

  const handleLike = () => {
    setIsLiked((v) => !v)
    setLikesCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1))
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    const cmt: Comment = {
      id: comments.length + 1,
      user: { name: "You", username: "@you", avatar: "/placeholder.svg?height=32&width=32" },
      content: newComment.trim(),
      timestamp: "now",
      likes: 0
    }
    setComments((arr) => [...arr, cmt])
    setNewComment("")
  }

  const onClickUser = () => {
    router.push(`/profile/${post.authorHandle}`)
  }

  const authorName = post.authorDisplayName ?? "Unknown"
  const authorHandle = post.authorHandle ? `@${post.authorHandle}` : ""
  const avatarSrc = post.authorAvatarUrl ?? "/diverse-profile-avatars.png"

  const createdAgo = timeSince(post.createdAt)
  const totalComments = (post.commentCount ?? 0) + comments.length

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onClickUser}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{authorName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{authorHandle} • {createdAgo}</div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {post.body && (
          <div className="px-6 pb-3">
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line">
              {post.body}
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="px-6 pb-2">
            <ImageCollage images={images} />
          </div>
        )}

        <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likesCount}
            </span>
          </div>
          <div className="cursor-pointer" onClick={() => setShowComments(true)}>
            {totalComments} comments
          </div>
        </div>

        <div className="px-2 py-1 border-y border-gray-100 dark:border-gray-700 flex">
          <Button
            variant="ghost"
            className={`flex-1 justify-center gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            Like
          </Button>
          <Button
            variant="ghost"
            className="flex-1 justify-center gap-2"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircle className="w-5 h-5" />
            Comment
          </Button>
          <Button
            variant="ghost"
            className="flex-1 justify-center gap-2"
            onClick={() => {/* share action */ }}
          >
            <Share className="w-5 h-5" />
            Share
          </Button>
        </div>

        {showComments && (
          <div className="pt-2">
            <div className="px-4 py-3 max-h-96 overflow-y-auto">
              {comments.map((cmt) => (
                <div key={cmt.id} className="flex items-start gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={cmt.user.avatar} />
                    <AvatarFallback>{cmt.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{cmt.user.name}</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{cmt.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-3 text-xs text-gray-500 dark:text-gray-400">
                      <button className="hover:underline">Like</button>
                      <button className="hover:underline">Reply</button>
                      <span>{cmt.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
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
                  size="icon"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-8 w-8"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
