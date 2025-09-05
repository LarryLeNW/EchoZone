import http from '@/lib/http'
import { ProfileResType, UpdateProfileType } from '@/schemaValidations/profile.schema'

const prefix = '/profile'
const profileApiRequest = {
  me: () => http.get<ProfileResType>(`${prefix}/me`),
  updateMe: (body: UpdateProfileType) => http.put<ProfileResType>(`${prefix}/me`, body),
  get: (handle: string) => http.get<ProfileResType>(`${prefix}/${handle}`),
}

export default profileApiRequest
