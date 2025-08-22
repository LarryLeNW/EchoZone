import { ProfileView } from "../../components/profile/profile-view"

interface ProfilePageProps {
  params: {
    userId: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <ProfileView userId={params.userId} />
}
