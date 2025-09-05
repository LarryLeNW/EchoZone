import { OtherProfile } from "@/components/profile/others-view"

type ProfileRouteParams = { params: { handle: string } }

export default function ProfilePage({ params }: ProfileRouteParams) {
  return <OtherProfile handle={params.handle} />
}