# Dự án mục đích học hỏi (.NET 8, ASP.NET Core Web API, EF Core, SQL Server,...)

## Yêu cầu
- .NET SDK 8
- SQL Server (localdb hoặc instance)
- EF Core Tools: `dotnet tool update --global dotnet-ef` (khuyến nghị)

## Cài & chạy
```bash
cd Education
dotnet restore
# Tạo migration + DB
dotnet ef migrations add Init
dotnet ef database update

# Chạy
dotnet run
# mở https://localhost:7212/swagger
```

## Chỉnh connection string
Sửa `appsettings.json` khóa `ConnectionStrings:Default` cho phù hợp máy bạn.

## Ghi chú
- Seed 2 bản ghi mẫu trong `OnModelCreating`.
- Pipeline đã cấu hình `UseExceptionHandler("/error")`, Swagger trong Development.
