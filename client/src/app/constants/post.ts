export const AudienceModeType = {
    Alow: 1,
    Deny: 2,
} as const

export const PostVisibility = {
    Public: 0,
    Followers: 1,
    Friends: 2,
    Private: 3,
    Custom: 4
} as const

export const ReactionType = {
    Like: 1, Love: 2, Haha: 3, Wow: 4, Sad: 5, Angry: 6, Care: 7
} as const

export const FollowStatus = {
    Pending: 0, Accepted: 1, Declined: 2
} as const
