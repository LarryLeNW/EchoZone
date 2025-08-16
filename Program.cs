using EmployeeApi.Extensions;
using EmployeeApi.Infrastructure;
using EmployeeApi.Services;
using Microsoft.EntityFrameworkCore; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default"))
);
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

builder.Services.AddAppServices();
builder.Services.AddSwaggerDocs(); 
builder.Services.AddJwtAuth(builder.Configuration); 

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        if (!db.Database.CanConnect())
        {
            Console.WriteLine("Không thể kết nối SQL.");
            Environment.Exit(1);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Không thể kết nối SQL: " + ex.Message);
        Environment.Exit(1);
    }
}

app.UseExceptionHandler("/error");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new { app = "api", time = DateTime.UtcNow }));

app.Run();
