using System.Text.Json.Serialization;

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

    public sealed record FieldError(
    [property: JsonPropertyName("field")] string Field,
    [property: JsonPropertyName("message")] string Message);

    public sealed class EntityException : Exception
    {
        public int Status { get; }
        public IReadOnlyList<FieldError> Fields { get; }

        public EntityException(
            IEnumerable<FieldError> fields,
            int status = StatusCodes.Status422UnprocessableEntity,
            string message = "Lỗi xác thực dữ liệu")
            : base(message)
        {
            Status = status;
            Fields = fields.ToList().AsReadOnly();
        }
    }

    public sealed class AuthException : Exception
    {
        public int Status { get; }
        public AuthException(string message = "Unauthorized",
                             int status = StatusCodes.Status401Unauthorized) : base(message)
        {
            Status = status;
        }
    }
}