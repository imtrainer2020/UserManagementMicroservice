using AuthService.API.Data;
using AuthService.API.Models;
using Shared.CL;
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
        public async Task<ApiResponse<int>> RegisterUserAsync(UserRegisterDto dto)
        {
            try
            {
                string securePasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.Password);
                await context.Users.AddAsync(new User
                {
                    Email = dto.Email,
                    PasswordHash = securePasswordHash
                });
                return ApiResponse<int>.Success(await context.SaveChangesAsync());
            }
            catch (Exception ex)
            {
                return ApiResponse<int>.Fail(ex.Message);
            }
        }
    }
}
