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
        public AuthRepository(AuthDbContext _context)
        {
            context = _context;
        }

        public async Task<string> LoginUserAsync(UserLoginDto dto)
        {
            // 1. Find the user
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) throw new Exception("Invalid Email or Password");

            // 2. Verify Password
            bool isPasswordValid = global::BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid) throw new Exception("Invalid Email or Password");

            // 3. Create the JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            // In a real app, keep this key in appsettings.json
            var key = Encoding.ASCII.GetBytes("ThisIsAMySuperSecretKeyForDevelopmentOnly12345");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    // Later, you can look up user roles and add them here:
                    // new Claim(ClaimTypes.Role, "Admin")
                }),
                Expires = DateTime.UtcNow.AddHours(2), // Token is valid for 2 hours
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
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
