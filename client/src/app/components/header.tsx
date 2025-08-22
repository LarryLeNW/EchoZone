"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Bell, Search, MessageCircle, Home, Compass } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { User, Settings, LogOut, Bookmark, HelpCircle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"
export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-200 dark:bg-gray-900/80 dark:border-purple-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-purple-800 dark:text-purple-300">SocialSphere</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm bạn bè, bài viết..."
                className="pl-10 bg-purple-50 border-purple-200 focus:border-purple-400 dark:bg-gray-800 dark:border-purple-700 dark:focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/20"
                asChild
              >
                <Link href="/">
                  <Home className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/20"
              >
                <Compass className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/20"
                asChild
              >
                <Link href="/chats">
                  <MessageCircle className="w-5 h-5" />
                </Link>
              </Button>
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/20"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="font-semibold text-base">Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/young-asian-person.png" />
                        <AvatarFallback>AN</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <span className="font-semibold">Anh Nguyễn</span> đã thích bài viết của bạn
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 phút trước</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/professional-headshot.png" />
                        <AvatarFallback>MT</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <span className="font-semibold">Mai Trần</span> đã bình luận: "Bài viết hay quá!"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">15 phút trước</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/diverse-profile-avatars.png" />
                        <AvatarFallback>HV</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <span className="font-semibold">Hùng Võ</span> đã chia sẻ bài viết của bạn
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 giờ trước</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Chào mừng bạn đến với <span className="font-semibold">SocialSphere</span>!
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 giờ trước</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 cursor-pointer text-center text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Xem tất cả thông báo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 border-2 border-purple-300 cursor-pointer hover:border-purple-400 transition-colors">
                  <AvatarImage src="/diverse-profile-avatars.png" />
                  <AvatarFallback className="bg-purple-600 text-white">U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Nguyễn Văn A</p>
                    <p className="text-xs leading-none text-muted-foreground">nguyenvana@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile/me" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Trang cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="cursor-pointer">
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Đã lưu</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Trợ giúp</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
