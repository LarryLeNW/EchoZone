// queries/useBlog.ts
import postApiRequest from "@/apiRequests/post";
import { CreatePostRequestType, GetPostsQueryParamsType, PostResponseType } from "@/schemaValidations/post.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const POST_KEYS = {
    all: ["posts"] as const,
    list: (params?: GetPostsQueryParamsType) => ["posts", params ?? {}] as const,
};

export const useCreatePostMutation = (paramsToRefetch?: GetPostsQueryParamsType) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: CreatePostRequestType) => postApiRequest.createPost(body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: POST_KEYS.all });
            if (paramsToRefetch) qc.invalidateQueries({ queryKey: POST_KEYS.list(paramsToRefetch) });
        },
    });
};

export const useGetPostListQuery = (params?: GetPostsQueryParamsType, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: POST_KEYS.list(params),
        queryFn: () => postApiRequest.getPostList(params),
        placeholderData: (prev) => prev,
        staleTime: 30_000,
        enabled: options?.enabled ?? true,
        select: (data): PostResponseType[] => data.payload,
    });
};
