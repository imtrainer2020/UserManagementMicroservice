using System;
using System.Collections.Generic;

namespace UserService.API.Models;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int RoleId { get; set; } = 2;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<UserDetail> UserDetails { get; set; } = new List<UserDetail>();
}
