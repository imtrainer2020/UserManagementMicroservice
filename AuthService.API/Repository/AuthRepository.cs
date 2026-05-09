using AuthService.API.Data;
using AuthService.API.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Shared.CL.DTOs;
using Shared.CL.Enums;

namespace AuthService.API.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AuthDbContext context;
        private readonly IConfiguration config;
        public AuthRepository(AuthDbContext _context, IConfiguration _config)
        {
            context = _context;
            config = _config;
        }

        public async Task<int> UpdateUserAsync(UserEditDto dto)
        {
            User? user = await GetUserByIdAsync(dto.Id);
            if (user == null) throw new Exception("User not found");

            user.Email = dto.Email;
            user.PasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.RoleId = (dto.RoleId > 0) ? dto.RoleId : 2; // Default to "User" role if not provided
            user.IsActive = dto.IsActive;

            return await context.SaveChangesAsync();
        }

        public async Task<bool> ForgetPasswordAsync(string email)
        {
            bool isEmailExist = await context.Users.AsNoTracking().AnyAsync(u => u.Email == email);
            return isEmailExist;
        }

        public async Task<string> LoginUserAsync(UserLoginDto dto)
        {
            // 1. Find the user
            User? user = await context.Users.AsNoTracking()
                                      .Include(u => u.Role)
                                      .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive == true);
            if (user == null) throw new Exception("Invalid Email or Password");

            // 2. Verify Password
            bool isPasswordValid = global::BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid) throw new Exception("Invalid Email or Password");

            // 3. Create the JWT Token
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(config["JwtSettings:Secret"]!);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role?.RoleName ?? RolesEnum.User.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(2), // Token is valid for 2 hours
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<int> RegisterUserAsync(UserRegisterDto dto)
        {
            User? user = await GetUserByEmailAsync(dto.Email);
            if (user != null) throw new Exception("Email already exists");

            user = new User
            {
                Email = dto.Email,
                PasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = (dto.RoleId > 0) ? dto.RoleId : 2 // Default to "User" role if not provided
            };

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return user.Id;
        }

        public async Task<int> ResetPasswordAsync(ResetPasswordDto dto)
        {
            User? user = await GetUserByEmailAsync(dto.Email);
            if (user == null) throw new Exception("User not found");

            user.PasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.Password);
            return await context.SaveChangesAsync();
        }

        public async Task<int> DeleteUserAsync(UserDeleteDto dto)
        {
            User? user = null;
            if (dto.Id != null && dto.Id > 0)
                user = await GetUserByIdAsync(dto.Id.Value);
            else if (dto.Email != null && dto.Email.Length > 0)
                user = await GetUserByEmailAsync(dto.Email);

            if (user == null) throw new Exception("User not found");

            context.Users.Remove(user);
            return await context.SaveChangesAsync();
        }

        public async Task<IList<UserListDto>> GetAllUsersAsync()
        {
            return await context.Users.AsNoTracking()
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    IsActive = u.IsActive
                })
                .ToListAsync();
        }

        public async Task<UserViewDto> ViewUserAsync(int? id, string? email)
        {
            User? user = null;
            if (id != null && id > 0)
                user = await GetUserByIdAsync(id.Value);
            else if (email != null && email.Length > 0)
                user = await GetUserByEmailAsync(email);

            if (user == null) throw new Exception("User not found");

            UserViewDto userViewDto = new UserViewDto
            {
                Id = user.Id,
                Email = user.Email,
                RoleId = user.RoleId,
                IsActive = user.IsActive,
                RoleName = (await context.Roles.AsNoTracking().FirstOrDefaultAsync(r => r.Id == user.RoleId))?.RoleName ?? "User"
            };
            return userViewDto;
        }

        public async Task<int> ChangeUserRolesAsync(ChangeUserRolesDto dto)
        {
            User? user = null;
            if (dto.Id != null && dto.Id > 0)
                user = await GetUserByIdAsync(dto.Id.Value);
            else if (dto.Email != null && dto.Email.Length > 0)
                user = await GetUserByEmailAsync(dto.Email);

            if (user == null) throw new Exception("User not found");

            user.RoleId = dto.RoleId;
            return await context.SaveChangesAsync();
        }

        private async Task<User?> GetUserByEmailAsync(string email)
        {
            return await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);
        }
        private async Task<User?> GetUserByIdAsync(int id)
        {
            return await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        }

    }
}
