import { ProfileView } from "@/components/profile/profile-view"

export default function MyProfilePage() {
  // Mock data for current user
  const currentUser = {
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

  return <ProfileView user={currentUser} />
}
