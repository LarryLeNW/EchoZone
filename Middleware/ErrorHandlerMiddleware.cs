using System.Text.Json;
using EmployeeApi.Extensions;
using Microsoft.AspNetCore.Mvc;

public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ex.StatusCode;

            var result = ex.ErrorCode.HasValue
                ? JsonSerializer.Serialize(new { message = ex.Message, code = ex.ErrorCode })
                : JsonSerializer.Serialize(new { message = ex.Message });

            await context.Response.WriteAsync(result);
        }
        catch (EntityException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ex.Status;
            System.Console.WriteLine("fields  : " + ex.Fields);
            var payload = new
            {
                message = ex.Message,
                status = ex.Status,
                errors = ex.Fields
            };

            await context.Response.WriteAsJsonAsync(payload);
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;

            var result = JsonSerializer.Serialize(new
            {
                error = "Internal Server Error",
#if DEBUG
                detail = ex.Message,
#endif
            });

            await context.Response.WriteAsync(result);
        }
    }
}
