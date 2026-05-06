using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.Filters
{
    public class RoleAuthFilter : IAuthorizationFilter
    {
        private readonly string[] _roles;
        public RoleAuthFilter(params string[] roles) => _roles = roles;

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            var userRole = user.FindFirst("role")?.Value ?? "";
            if (!_roles.Contains(userRole))
                context.Result = new ForbidResult();
        }
    }
}
