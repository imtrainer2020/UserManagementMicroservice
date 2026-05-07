using AuthService.API.Data;
using AuthService.API.Models;
using Shared.CL;
using Shared.CL.DTOs.AuthDto;

namespace AuthService.API.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AuthDbContext context;
        public AuthRepository(AuthDbContext _context)
        {
            context = _context;
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
