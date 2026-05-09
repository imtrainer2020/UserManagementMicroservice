using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Shared.CL.Filters
{
    public class JwtAuthFilter : IAsyncAuthorizationFilter
    {
        private readonly IConfiguration config;
        public JwtAuthFilter(IConfiguration _config)
        {
            this.config = _config;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // 1. Skip authentication if the endpoint has [AllowAnonymous]
            bool allowAnonymous = context.ActionDescriptor.EndpointMetadata
                                         .Any(em => em.GetType() == typeof(AllowAnonymousAttribute));
            if (allowAnonymous) return;

            // 2. Check for the Authorization header
            var authHeader = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                // UPDATED: Using ObjectResult to match the GlobalExceptionFilter pattern
                context.Result = new ObjectResult(ApiResponse<object>.Fail("Unauthorized. Missing or invalid token."))
                {
                    StatusCode = 401
                };
                return;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();

                string secretKey = config["JwtSettings:Secret"] ?? "ThisIsMySuperSecretKeyForDevelopmentOnly1234567890";
                var key = Encoding.ASCII.GetBytes(secretKey);

                // 3. Validate Token
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                // 4. Attach the User Identity to the HttpContext
                var jwtToken = (JwtSecurityToken)validatedToken;
                var identity = new System.Security.Claims.ClaimsIdentity(jwtToken.Claims, "jwt");
                context.HttpContext.User = new System.Security.Claims.ClaimsPrincipal(identity);
            }
            catch (Exception)
            {
                // UPDATED: Using ObjectResult for failures
                context.Result = new ObjectResult(ApiResponse<object>.Fail("Unauthorized. Token expired or invalid."))
                {
                    StatusCode = 401
                };
            }
        }
    }
}