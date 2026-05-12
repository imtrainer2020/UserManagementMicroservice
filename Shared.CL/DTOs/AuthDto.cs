using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Shared.CL.DTOs
{
    public record UserRegisterDto(string Email, string Password, int RoleId = 2);

    public record LoggedUserDto(string JwtToken, int? UserId, string? Email, string? RoleName);
    public record UserEditDto
    {
        public int Id { get; init; }
        public string Email { get; init; } = null!;
        public string Password { get; init; } = null!;
        public int RoleId { get; init; } = 2;
        public bool IsActive { get; init; } = true;
    }
    public record UserLoginDto(string Email, string Password);
    public record ResetPasswordDto(string Email, string NewPassword);
    public record UserDeleteDto(int? Id, string? Email);
    public record ChangeUserRolesDto : UserDeleteDto
    {
        public ChangeUserRolesDto(int? Id, string? Email) : base(Id, Email)
        {

        }
        public int RoleId { get; init; } = 2;
    }
    public record UserViewDto
    {
        public int Id { get; init; }
        public string Email { get; init; } = null!;
        public int RoleId { get; init; } = 2;
        public bool IsActive { get; init; } = true;
        public string RoleName { get; init; } = "User";
    }
    public record UserListDto
    {
        public int Id { get; init; }
        public string Email { get; init; } = null!;
        public bool IsActive { get; init; } = true;
    }
}
