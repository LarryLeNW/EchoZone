using EmployeeApi.Extensions;
using EmployeeApi.Infrastructure;
using EmployeeApi.Mapping;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };

        o.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                string? token = null;

                if (ctx.Request.Cookies.TryGetValue("accessToken", out var cookieToken) &&
                    !string.IsNullOrWhiteSpace(cookieToken))
                {
                    token = cookieToken;
                }

                if (string.IsNullOrEmpty(token))
                {
                    var auth = ctx.Request.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(auth) &&
                        auth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        token = auth.Substring("Bearer ".Length).Trim();
                    }
                }

                if (!string.IsNullOrEmpty(token))
                    ctx.Token = token;

                Console.WriteLine("Token picked by API: " + (token ?? "<null>"));

                return Task.CompletedTask;
            }
        };
    });

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
              .AllowAnyMethod()
               .AllowCredentials();
    });
});

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
app.UseCors("AllowSpecificOrigins");
app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new { app = "api", time = DateTime.UtcNow }));

app.Run();
