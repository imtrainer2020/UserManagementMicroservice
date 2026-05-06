using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.DTOs.AuthDto
{
    public class UserRegisterDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
