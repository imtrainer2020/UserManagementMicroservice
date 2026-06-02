using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Shared.CL.Enums;
using System;
using System.Security.Claims;

namespace Shared.CL.Filters
{
    public class RoleAuthorizeFilter : IAsyncAuthorizationFilter
    {
        private readonly RolesEnum[] allowedRoles;
        public RoleAuthorizeFilter(RolesEnum[] roles) => allowedRoles = roles;

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // Skip authorization if [AllowAnonymous] is present
            bool allowAnonymous = await Task.FromResult(context.ActionDescriptor.EndpointMetadata
                                         .Any(em => em.GetType() == typeof(AllowAnonymousAttribute)));
            if (allowAnonymous) return;

            ClaimsPrincipal user = await Task.FromResult(context.HttpContext.User);
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new ObjectResult(ApiResponse<object>.Fail("Unauthorized access."))
                { StatusCode = 401 };
                return;
            }
            // If the attribute is empty [RoleAuthorize], just being logged in is enough
            if (allowedRoles == null || allowedRoles.Length == 0) return;

            // Extract the user's roles from their JWT claims
            var userRoles = await Task.FromResult(user.Claims
                                .Where(c => c.Type == ClaimTypes.Role || c.Type == "role")
                                .Select(c => c.Value));

            // Check if any of the user's roles match the allowed roles
            bool hasAccess = allowedRoles.Any(role => userRoles.Contains(role.ToString()));

            if (!hasAccess)
            {
                context.Result = new ObjectResult(ApiResponse<object>
                    .Fail("Forbidden. You do not have the required permissions to perform this action."))
                { StatusCode = 403 };
            }
        }
    }

    // This allows us to use [RoleAuthorize("Admin", "Teacher")] on controllers
    public class RoleAuthorizeAttribute : TypeFilterAttribute
    {
        public RoleAuthorizeAttribute(params RolesEnum[] roles) : base(typeof(RoleAuthorizeFilter))
        {
            Arguments = new object[] { roles };
        }
    }
}
