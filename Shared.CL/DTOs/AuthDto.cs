using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.DTOs
{
    public record UserRegisterDto(string Email, string Password);
    public record UserLoginDto(string Email, string Password);
}
