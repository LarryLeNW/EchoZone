namespace EmployeeApi.Extensions
{
    public class AppException : Exception
    {
        public int StatusCode { get; }
        public int? ErrorCode { get; }

        public AppException(string message, int statusCode = 400, int? errorCode = null) : base(message)
        {
            StatusCode = statusCode;
            ErrorCode = errorCode;
        }
    }
}