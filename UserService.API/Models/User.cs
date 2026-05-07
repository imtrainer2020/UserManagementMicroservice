using System;
using System.Collections.Generic;

namespace UserService.API.Models;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<UserRolesMapping> UserRolesMappings { get; set; } = new List<UserRolesMapping>();
}
