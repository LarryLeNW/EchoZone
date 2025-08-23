import z from 'zod'

export const ProfileSchema = z.object({
  userId: z.number(),
  displayName: z.string(),
  handle: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  isPrivate: z.string().nullable()
})

export type ProfileType = z.TypeOf<typeof ProfileSchema>

export const ProfileRes = z
  .object({
    data: ProfileSchema,
    message: z.string()
  })
  .strict()

export type ProfileResType = z.TypeOf<typeof ProfileRes>
