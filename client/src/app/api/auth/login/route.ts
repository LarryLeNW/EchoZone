import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'
import { HttpError } from '@/lib/http'
import { LoginBodyType } from '@/schemaValidations/auth.schema'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = await cookies()
  try {
    const { payload } = await authApiRequest.sLogin(body)
    const { accessToken, refreshToken, refreshExpiresAt, accessExpiresAt } = payload
    const at = new Date(accessExpiresAt)
    const rt = new Date(refreshExpiresAt)
    const atExpires = isNaN(at.getTime()) ? undefined : at
    const rtExpires = isNaN(rt.getTime()) ? undefined : rt
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      ...(atExpires ? { expires: atExpires } : {})
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      ...(rtExpires ? { expires: rtExpires } : {})
    })
    return Response.json(payload)
  } catch (error) {
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
