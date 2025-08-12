using System.Text;
using EmployeeApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using EmployeeApi.Repositories;
using EmployeeApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuration & Services
builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
{
    // Keep default automatic model validation response with [ApiController]
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EmployeeApi", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Nhập JWT token dạng: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default"))
);
// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Example of DI registration
builder.Services.AddScoped<IClock, SystemClock>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>(); 
var app = builder.Build();

// ======== Pipeline (Order matters) ========

// Global exception handler (Production-friendly)
app.UseExceptionHandler("/error");

// Development helpers
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

// If you add authentication/authorization later, keep them here
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Minimal health ping (also have HealthController)
app.MapGet("/", () => Results.Ok(new { app = "EmployeeApi", time = DateTime.UtcNow }));

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); 
}

app.Run();

// For DI demo
public interface IClock
{
    DateTime UtcNow();
}
public class SystemClock : IClock
{
    public DateTime UtcNow() => DateTime.UtcNow;
}
