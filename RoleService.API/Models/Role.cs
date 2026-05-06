using System;
using System.Collections.Generic;

namespace RoleService.API.Models;

public partial class Role
{
    public int Id { get; set; }

    public string RoleName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
