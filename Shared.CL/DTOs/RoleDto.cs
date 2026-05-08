using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.DTOs
{
    public record RoleCreateDto(string RoleName);
    public record RoleUpdateDto(int Id, string RoleName);
    public record RoleViewDto(int Id, string RoleName, DateTime CreatedAt);
}
