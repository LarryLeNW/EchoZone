"use client"

import { useState } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { PostCard } from "../post-card"
import { MapPin, Calendar, LinkIcon, Camera, Edit3, Settings, MoreHorizontal, Heart } from "lucide-react"
import { useProfileMe, useUpdateMeMutation } from "@/queries/useProfile"
import { CreatePost } from "@/components/create-post"
// import { useGetPostListQuery } from "@/queries/useBlog"
import { PostResponseType } from "@/schemaValidations/post.schema"
import ImageUpload from "@/components/upload"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"
import { UpdateProfileType } from "@/schemaValidations/profile.schema"
import { useQueryClient } from "@tanstack/react-query"
import { PostList } from "@/components/posts/post-list"


const mockMediaPosts = [
  { id: 1, image: "/mobile-app-mockup.png", likes: 234 },
  { id: 2, image: "/professional-headshot.png", likes: 156 },
  { id: 3, image: "/placeholder-573u4.png", likes: 89 },
  { id: 4, image: "/young-asian-person.png", likes: 67 },
]

const user = {
  id: "me",
  name: "Nguyễn Văn A",
  username: "@nguyenvana",
  bio: "Passionate developer & content creator. Love sharing knowledge and connecting with amazing people! 🚀",
  avatar: "/diverse-profile-avatars.png",
  coverImage: "/placeholder-573u4.png",
  location: "Ho Chi Minh City, Vietnam",
  website: "nguyenvana.dev",
  joinDate: "January 2023",
  followers: 1234,
  following: 567,
  posts: 89,
  isOwnProfile: true,
}

export function ProfileView() {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const { data: me } = useProfileMe();
  const [isUploadAvatar, setIsUploadAvatar] = useState<boolean>(false);
  const updateMeMutation = useUpdateMeMutation();


  const handleUpdateAvatar = async (avatarUrl: string) => {
    if (!avatarUrl) return;
    try {
      const payload: UpdateProfileType = {
        avatarUrl
      };

      await updateMeMutation.mutateAsync(payload);
      queryClient.setQueryData(['profile-me'], (oldData: any) => ({
        ...oldData,
        payload: {
          ...oldData?.payload,
          avatarUrl
        }
      }));
      toast.success("Cập nhật avatar thành công !");
    } catch (error) {
      toast.warning("Vui lòng thử lại!");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="relative h-64 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-b-2xl overflow-hidden">
          <img src={me?.payload?.avatarUrl || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30"></div>

          {user.isOwnProfile && (
            <Button size="sm" className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0">
              <Camera className="w-4 h-4 mr-2" />
              Edit Cover
            </Button>
          )}
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage src={me?.payload?.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-purple-600 text-white text-2xl">{me?.payload?.displayName}</AvatarFallback>
                </Avatar>
                {user.isOwnProfile && (
                  <ImageUpload
                    updateStatus={(status) => setIsUploadAvatar(status)}
                    onUploadSuccess={(urls: string[]) => {
                      handleUpdateAvatar(urls[0])
                    }}
                    isUploading={isUploadAvatar}
                  >
                    <Button
                      size="sm"
                      className="absolute bottom-2 right-2 w-8 h-8 p-0 rounded-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </ImageUpload>
                )}
              </div>

              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{me?.payload?.displayName}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">197 friends</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.joinDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <span className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                        {user.website}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-end space-x-3">
              {user.isOwnProfile ? (
                <>
                  <Button
                    variant="outline"
                    className="px-6 py-2 rounded-full font-semibold border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4 py-2 rounded-full border-gray-200 dark:border-gray-700 bg-transparent"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-8 py-2 rounded-full font-semibold transition-all duration-300 ${isFollowing
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-2 rounded-full font-semibold border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 bg-transparent"
                  >
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4 py-2 rounded-full border-gray-200 dark:border-gray-700 bg-transparent"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">{user.bio}</p>
          </div>

          <div className="flex justify-center md:justify-start space-x-8 mt-6">
            <div className="text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-lg transition-colors">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.posts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
            </div>
            <div className="text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-lg transition-colors">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
            </div>
            <div className="text-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-lg transition-colors">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.following}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
            </div>
          </div>
        </div>

        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <TabsTrigger value="posts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Posts
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Media
              </TabsTrigger>
              <TabsTrigger value="likes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Likes
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              <CreatePost />
              <PostList />
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockMediaPosts.map((media) => (
                  <div key={media.id} className="relative group cursor-pointer">
                    <img
                      src={media.image || "/placeholder.svg"}
                      alt="Media post"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-5 h-5" />
                          <span>{media.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="space-y-6">
              {/* {posts.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))} */}
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bio</h4>
                    <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                  </div>

                  {user.location && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Location</h4>
                      <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                  )}

                  {user.website && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Website</h4>
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="w-4 h-4 text-gray-500" />
                        <a
                          href={`https://${user.website}`}
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          {user.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {user.joinDate && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Joined</h4>
                      <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{user.joinDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div >
  )
}
