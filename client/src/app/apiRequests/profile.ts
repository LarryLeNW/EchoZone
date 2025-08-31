import http from '@/lib/http'
import { ProfileResType } from '@/schemaValidations/profile.schema'

const prefix = '/profile'
const profileApiRequest = {
  me: () => http.get<ProfileResType>(`${prefix}/me`),
}

export default profileApiRequest
