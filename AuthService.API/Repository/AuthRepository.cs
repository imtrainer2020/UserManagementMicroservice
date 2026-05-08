using AuthService.API.Data;
using AuthService.API.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Shared.CL.DTOs;

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

        private async Task<string> GetRoleNamefromUserIdAsync(int userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");
            return user.Role.RoleName;
        }
        private async Task<string> GetRoleNamefromEmailAsync(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) throw new Exception("User not found");
            return user.Role.RoleName;
        }

        public async Task<string> LoginUserAsync(UserLoginDto dto)
        {
            // 1. Find the user
            User? user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
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
                    new Claim(ClaimTypes.Role, await GetRoleNamefromUserIdAsync(user.Id))
                }),
                Expires = DateTime.UtcNow.AddHours(2), // Token is valid for 2 hours
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<int> RegisterUserAsync(UserRegisterDto dto)
        {
            string securePasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = securePasswordHash
            };

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return user.Id;
        }
    }
}
