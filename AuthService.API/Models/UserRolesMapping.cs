using System;
using System.Collections.Generic;

namespace AuthService.API.Models;

public partial class UserRolesMapping
{
    public int UserId { get; set; }

    public int RoleId { get; set; }
}
