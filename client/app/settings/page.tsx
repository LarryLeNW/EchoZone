import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User, Bell, Shield, Palette, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Cài đặt</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và tùy chọn tài khoản của bạn</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <User className="w-5 h-5" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>Cập nhật thông tin hồ sơ và ảnh đại diện của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-purple-200">
                  <AvatarImage src="/diverse-profile-avatars.png" />
                  <AvatarFallback className="bg-purple-600 text-white text-xl">A</AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Thay đổi ảnh
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG tối đa 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    defaultValue="Nguyễn Văn A"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Tên người dùng</Label>
                  <Input
                    id="username"
                    defaultValue="nguyenvana"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="nguyenvana@example.com"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Tiểu sử</Label>
                <Textarea
                  id="bio"
                  placeholder="Viết vài dòng về bản thân..."
                  defaultValue="Passionate developer & content creator. Love sharing knowledge and connecting with amazing people! 🚀"
                  className="border-purple-200 focus:border-purple-400 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Shield className="w-5 h-5" />
                Quyền riêng tư
              </CardTitle>
              <CardDescription>Kiểm soát ai có thể xem nội dung và tương tác với bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Tài khoản riêng tư</Label>
                  <p className="text-sm text-gray-500">Chỉ những người bạn theo dõi mới có thể xem bài viết của bạn</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Hiển thị trạng thái hoạt động</Label>
                  <p className="text-sm text-gray-500">Cho phép bạn bè xem khi bạn đang online</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Cho phép tìm kiếm bằng email</Label>
                  <p className="text-sm text-gray-500">Người khác có thể tìm thấy bạn qua địa chỉ email</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Bell className="w-5 h-5" />
                Thông báo
              </CardTitle>
              <CardDescription>Chọn loại thông báo bạn muốn nhận</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Thông báo push</Label>
                  <p className="text-sm text-gray-500">Nhận thông báo trên thiết bị của bạn</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Thông báo email</Label>
                  <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Thông báo bình luận</Label>
                  <p className="text-sm text-gray-500">Thông báo khi có người bình luận bài viết của bạn</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Thông báo theo dõi</Label>
                  <p className="text-sm text-gray-500">Thông báo khi có người theo dõi bạn</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Palette className="w-5 h-5" />
                Giao diện
              </CardTitle>
              <CardDescription>Tùy chỉnh giao diện ứng dụng theo sở thích của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Chế độ hiển thị</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="border-purple-300 text-purple-700 bg-transparent">
                    Sáng
                  </Button>
                  <Button variant="outline" className="border-purple-300 bg-transparent">
                    Tối
                  </Button>
                  <Button variant="outline" className="border-purple-300 bg-transparent">
                    Tự động
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Ngôn ngữ</Label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <select className="flex-1 p-2 border border-purple-200 rounded-md focus:border-purple-400 focus:outline-none">
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-purple-300 text-purple-700 bg-transparent">
              Hủy bỏ
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
