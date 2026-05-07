using Microsoft.EntityFrameworkCore;
using Shared.CL;
using Shared.CL.DTOs.UserDetailDto;
using UserService.API.Data;
using UserService.API.Models;

namespace UserService.API.Repository
{
    public class UserDetailsRepository : IUserDetailsRepository
    {
        private readonly UserDbContext context;

        public UserDetailsRepository(UserDbContext _context)
        {
            context = _context;
        }

        public async Task<ApiResponse<int>> CreateRoleAsync(UserDetailCreateDto dto)
        {
			try
			{
                await context.UserDetails.AddAsync(new UserDetail
                {
                    Address = dto.Address,
                    Fullname = dto.Fullname,
                    PhotoUrl = dto.PhotoUrl,
                    Phone = dto.Phone,
                    UserId = dto.UserId
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
