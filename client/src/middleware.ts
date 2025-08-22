import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './config'
import { Role } from './app/constants'
import { TokenPayload } from './app/@types/jwt.types'

const decodeToken = (token: string) => jwt.decode(token) as TokenPayload

const managePaths = ['/vi/manage', '/en/manage']
const guestHomePaths = ['/vi', '/en']
const onlyOwnerPaths = ['/vi/manage/accounts', '/en/manage/accounts']

const privatePrefixes = [...managePaths]
const privateExact = [...guestHomePaths]

const unAuthPaths = ['/vi/login', '/en/login']
const loginPaths = unAuthPaths

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({ locales, defaultLocale })
  const response = handleI18nRouting(request)

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

  const isLoginPage = loginPaths.some(p => pathname === p || pathname.startsWith(p + '/'))

  const isPrivateByPrefix = privatePrefixes.some(p => pathname.startsWith(p))
  const isPrivateByExact =
    privateExact.some(p => pathname === p || pathname === p + '/')

  if ((isPrivateByPrefix || isPrivateByExact) && !refreshToken && !isLoginPage) {
    const url = new URL(`/${locale}/login`, request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }


  return response
}

export const config = {
  matcher: ['/', '/(vi|en)/:path*']
}
