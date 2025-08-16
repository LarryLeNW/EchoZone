using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeApi.Constants
{
    public class ErrorMessages
    {
        public const string EmailExists = "Email đã tồn tại";
        public const string UserNotFound = "Người dùng không tồn tại";
        public const string InvalidPassword = "Mật khẩu không đúng";
        public const string Unauthorized = "Bạn chưa đăng nhập hoặc token hết hạn";
        public const string Forbidden = "Bạn không có quyền truy cập tài nguyên này";
    }
}