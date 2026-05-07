using System;
using System.Collections.Generic;

namespace UserService.API.Models;

public partial class UserDetail
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? Fullname { get; set; }

    public string? PhotoUrl { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public DateTime CreatedAt { get; set; }
}
