using System.Text;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
         IConfiguration config)
         {
            services.AddIdentityCore<AppUser>(opt => 
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<DataContext>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            //TokenKey is in Pascal casing

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer( opt => 
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
                
            services.AddScoped<TokenService>();//this is scoped to the html request AddTransient would
            // create the the service specifically for the method, AddSingleton would create
            // the service when the app starts and lives until the app shuts down, but these 
            //don't have the required lifespan

            services.AddScoped<TokenService>();


            return services;
         }
    }
}