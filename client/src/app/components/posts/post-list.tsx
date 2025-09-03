"use client"
import { useEffect, useRef } from "react"
import { PostCard } from "@/components/post-card"
import { usePostListInfinite } from "@/queries/useBlog"
import { useProfileMe } from "@/queries/useProfile";
import { usePathname } from "next/navigation";

export function PostList() {
    const pathname = usePathname()
    const { data: me } = useProfileMe()
    const authorId = me?.payload?.userId as string | undefined
    const isMePage = pathname.split("/").filter(Boolean).pop() === "me"

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = usePostListInfinite(isMePage && authorId ? { authorId } : undefined)

    const loaderRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!loaderRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage()
                }
            },
            { threshold: 1 }
        )

        observer.observe(loaderRef.current)
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current)
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    if (status === "pending") return <p>Đang tải...</p>
    if (status === "error") return <p>Có lỗi xảy ra!</p>

    return (
        <div className="space-y-6">
            {data?.pages.flatMap((page) =>
                page.items.map((post) => (
                    <PostCard key={post.postId} post={post} />
                ))
            )}

            <div ref={loaderRef} className="flex justify-center py-4">
                {isFetchingNextPage ? (
                    <p>Đang tải thêm...</p>
                ) : hasNextPage ? (
                    <p>Kéo xuống để xem thêm</p>
                ) : (
                    <p>Hết bài viết</p>
                )}
            </div>
        </div>
    )
}
