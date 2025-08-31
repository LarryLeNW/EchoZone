import postApiRequest from '@/apiRequests/post'
import { useMutation } from '@tanstack/react-query'

export const useCreatePostMutation = () => {
    return useMutation({
        mutationFn: postApiRequest.createPost,
        onSuccess: () => {
            console.log("create post successfully ... ")
        }
    })
}
