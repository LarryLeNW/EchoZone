import { z } from "zod"

export const AuthSchema = z.object({
  displayName: z.string().min(2, "Tên người dùng ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
})
export type AuthSchemaType = z.infer<typeof AuthSchema>
