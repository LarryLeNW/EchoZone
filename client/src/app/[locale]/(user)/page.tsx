import { Header } from "../../components/header"
import { PostCard } from "../../components/post-card"
import { CreatePost } from "../../components/create-post"
import { TrendingTopics } from "../../components/trending-topics"
import { RightSidebar } from "../../components/right-sidebar"

const mockPosts = [
  {
    id: 1,
    user: {
      name: "Alex Chen",
      username: "@alexchen",
      avatar: "/young-asian-person.png",
    },
    content: "Just discovered this amazing coffee shop in downtown! The latte art is incredible ☕✨",
    image: "/placeholder-qucvb.png",
    likes: 24,
    comments: 8,
    shares: 3,
    timestamp: "2h ago",
  },
  {
    id: 2,
    user: {
      name: "Maria Santos",
      username: "@mariasantos",
      avatar: "/latina-woman-smiling.png",
    },
    content: "Working on my new digital art piece. What do you think of this color palette? 🎨",
    image: "/abstract-digital-purple.png",
    likes: 156,
    comments: 23,
    shares: 12,
    timestamp: "4h ago",
  },
  {
    id: 3,
    user: {
      name: "David Kim",
      username: "@davidkim",
      avatar: "/korean-man-glasses.png",
    },
    content: "Beautiful sunset from my rooftop garden. Nature never fails to inspire! 🌅🌱",
    image: "/sunset-rooftop-garden.png",
    likes: 89,
    comments: 15,
    shares: 7,
    timestamp: "6h ago",
  },
]
export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-20">
            <div className="group space-y-6 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto pr-1 custom-scrollbar">
              <TrendingTopics />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <CreatePost />
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-20">
            <div className="group space-y-6 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto pl-1 custom-scrollbar">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

