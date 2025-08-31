import { z } from 'zod'

export const CreatePostRequestSchema = z.object({
    body: z.string().nullable(),
    mediaJson: z.string().nullable().optional().default(null),
    visibility: z.number(),
    allowComments: z.boolean().default(true),
    allowReactions: z.boolean().default(true),
    allowUserIds: z.array(z.string().uuid()).optional(),
    denyUserIds: z.array(z.string().uuid()).optional()
}).refine(
    (data) => {
        const hasBody = data.body && data.body.trim() !== "";
        const hasMedia = data.mediaJson && data.mediaJson.trim() !== "";
        return hasBody || hasMedia;
    },
    {
        message: "Bài viết cần có nội dung hoặc hình ảnh.",
        path: ["body"]
    }
)


export type CreatePostRequestType = z.TypeOf<typeof CreatePostRequestSchema>

export const UpdatePostRequestSchema = z.object({
    body: z.string().nullable().optional(),
    mediaJson: z.string().nullable().optional(),
    visibility: z.number().optional(),
    allowComments: z.boolean().optional(),
    allowReactions: z.boolean().optional(),
    allowUserIds: z.array(z.string().uuid()).optional(),
    denyUserIds: z.array(z.string().uuid()).optional()
})

export type UpdatePostRequestType = z.TypeOf<typeof UpdatePostRequestSchema>

export const PostResponseSchema = z.object({
    postId: z.string().uuid(),
    authorId: z.string().uuid(),
    body: z.string().nullable(),
    mediaJson: z.string().nullable(),
    visibility: z.number(),
    allowComments: z.boolean(),
    allowReactions: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string().nullable(),
    commentCount: z.number(),
    reactionCount: z.number()
})

export type PostResponseType = z.TypeOf<typeof PostResponseSchema>
