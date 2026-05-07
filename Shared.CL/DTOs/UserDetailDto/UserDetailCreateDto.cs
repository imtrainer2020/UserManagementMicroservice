using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.DTOs.UserDetailDto
{
    public class UserDetailCreateDto
    {
        public int UserId { get; set; }

        public string? Fullname { get; set; }

        public string? PhotoUrl { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }
    }
}
