"use client"
import { PostCard } from "../../components/post-card"
import { CreatePost } from "../../components/create-post"
import { TrendingTopics } from "../../components/trending-topics"
import { RightSidebar } from "../../components/right-sidebar"
import { PostList } from "@/components/posts/post-list"

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
          <PostList />
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

