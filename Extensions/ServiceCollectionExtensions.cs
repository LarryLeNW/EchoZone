using EmployeeApi.Services;
using EmployeeApi.Repositories;

namespace EmployeeApi.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProfileRepository, ProfileRepository>();
            services.AddScoped<ICredentialRepository, CredentialRepository>();
            services.AddScoped<ISessionRepository, SessionRepository>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IPasswordService, PasswordService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPostAccessService, PostAccessService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddHttpContextAccessor();
            return services;
        }
    }
}
