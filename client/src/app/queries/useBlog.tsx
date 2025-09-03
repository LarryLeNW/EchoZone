// queries/useBlog.ts
import { PagedResult } from "@/@types";
import postApiRequest from "@/apiRequests/post";
import { CreatePostRequestType, GetPostsQueryParamsType, PostResponseType } from "@/schemaValidations/post.schema";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const usePostListInfinite = (
    params?: GetPostsQueryParamsType,
    options?: { enabled?: boolean }
) => {
    return useInfiniteQuery<PagedResult<PostResponseType>, Error>({
        queryKey: POST_KEYS.list(params),
        queryFn: async ({ pageParam }) => {
            const res = await postApiRequest.getPostList({
                ...params,
                page: pageParam as number,
            });
            if (!res.payload) throw new Error("No payload");
            return res.payload;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.hasNext ? lastPage.page + 1 : undefined,
        enabled: options?.enabled ?? true,
    });
};
