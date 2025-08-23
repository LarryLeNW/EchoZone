
import profileApiRequest from '@/apiRequests/profile'
import { useQuery } from '@tanstack/react-query'

export const useProfileMe = () => {
  return useQuery({
    queryKey: ['profile-me'],
    queryFn: profileApiRequest.me
  })
}
