
import profileApiRequest from '@/apiRequests/profile'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useProfileMe = () => {
  return useQuery({
    queryKey: ['profile-me'],
    queryFn: profileApiRequest.me
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: profileApiRequest.updateMe
  })
}

export const useGetOthersProfile = (handle: string) => {
  return useQuery({
    queryKey: ['profile', handle],
    queryFn: () => profileApiRequest.get(handle),
    staleTime: 1000 * 60 * 5
  })
}
