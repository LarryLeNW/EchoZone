import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './config'

const managePrefixes = ['/vi/manage', '/en/manage']
const guestHomeExact = ['/vi', '/en']
const loginPaths = ['/vi/login', '/en/login']
const refreshPaths = ['/vi/refresh-token', '/en/refresh-token']

const isExact = (pathname: string, p: string) => pathname === p || pathname === p + '/'
const startsWithAny = (pathname: string, arr: string[]) => arr.some(p => pathname.startsWith(p))
const isLogin = (pathname: string) => loginPaths.some(p => isExact(pathname, p) || pathname.startsWith(p + '/'))
const isRefresh = (pathname: string) => refreshPaths.some(p => isExact(pathname, p) || pathname.startsWith(p + '/'))
const isGuestHome = (pathname: string) => guestHomeExact.some(p => isExact(pathname, p))

const intlMiddleware = createMiddleware({ locales, defaultLocale })

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  const { pathname, searchParams } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  console.log("🚀 ~ middleware ~ refreshToken:", refreshToken)
  const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

  if (isLogin(pathname) || isRefresh(pathname)) {
    if (refreshToken && isLogin(pathname) && !searchParams.get('accessToken')) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
    return response
  }

  const inManage = startsWithAny(pathname, managePrefixes)
  const inGuestHome = isGuestHome(pathname)
  const inPrivate = inManage || inGuestHome

  // if (!refreshToken && inPrivate) {
  //   const url = new URL(`/${locale}/login`, request.url)
  //   url.searchParams.set('clearTokens', 'true')
  //   return NextResponse.redirect(url)
  // }

  // if (refreshToken && !accessToken && inPrivate) {
  //   const url = new URL(`/${locale}/refresh-token`, request.url)
  //   url.searchParams.set('redirect', pathname)
  //   return NextResponse.redirect(url)
  // }

  return response
}

export const config = {
  matcher: ['/', '/(vi|en)/:path*']
}
