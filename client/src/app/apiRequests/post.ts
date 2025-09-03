import { PagedResult } from '@/@types'
import http from '@/lib/http'
import { CreatePostRequestType, GetPostsQueryParamsType, PostResponseType } from '@/schemaValidations/post.schema'
import queryString from 'query-string'

const prefix = '/posts'
const postApiRequest = {
    createPost: (body: CreatePostRequestType) =>
        http.post<PostResponseType>(`${prefix}`, body),
    getPostList: (queryParams?: GetPostsQueryParamsType) =>
        http.get<PagedResult<PostResponseType>>(
            `${prefix}${queryParams
                ? `?${queryString.stringify(queryParams, {
                    skipNull: true,
                    skipEmptyString: true,
                })}`
                : ''
            }`
        ),
}

export default postApiRequest