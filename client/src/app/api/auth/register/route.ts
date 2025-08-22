import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import { RegisterBodyType } from '@/@types/auth.schema'

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterBodyType
  const cookieStore = await cookies()
  try {
    const { payload } = await authApiRequest.sRegister(body)
    const { accessToken, refreshToken, refreshExpiresAt, accessExpiresAt } = payload
    const at = new Date(accessExpiresAt)
    const rt = new Date(refreshExpiresAt)
    const atExpires = isNaN(at.getTime()) ? undefined : at
    const rtExpires = isNaN(rt.getTime()) ? undefined : rt
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      ...(atExpires ? { expires: atExpires } : {})
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      ...(rtExpires ? { expires: rtExpires } : {})
    })
    return Response.json(payload)
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}
