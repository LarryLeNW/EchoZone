import http from '@/lib/http'
import { CreatePostRequestType, PostResponseType } from '@/schemaValidations/post.schema'

const prefix = '/posts'
const postApiRequest = {
    createPost: (body: CreatePostRequestType) =>
        http.post<PostResponseType>(`${prefix}`, body),
}

export default postApiRequest
