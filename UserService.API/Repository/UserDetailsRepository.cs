using Microsoft.EntityFrameworkCore;
using Shared.CL;
using Shared.CL.DTOs;
using Shared.CL.Repository;
using UserService.API.Data;
using UserService.API.Models;

namespace UserService.API.Repository
{
    public class UserDetailsRepository : IUserDetailsRepository
    {
        private readonly UserDbContext context;
        private readonly IPhotoUploadService photoService;

        public UserDetailsRepository(UserDbContext _context, IPhotoUploadService _photoService)
        {
            context = _context;
            photoService = _photoService;
        }

        public async Task<int> AddUserDetailsAsync(UserDetailCreateDto dto, IFormFile? file = null)
        {
            UserDetail ud = new UserDetail
            {
                Address = dto.Address,
                Fullname = dto.Fullname,
                Phone = dto.Phone,
                UserId = dto.UserId,
                PhotoUrl = dto.PhotoUrl
            };

            if (ud.PhotoUrl != null && ud.PhotoUrl.Length > 0)
                photoService.DeletePhoto(ud.PhotoUrl);

            if (file != null && file.Length > 0)
                ud.PhotoUrl = await photoService.SavePhotoAsync(file);

            await context.UserDetails.AddAsync(ud);
            await context.SaveChangesAsync();

            return ud.Id;
        }

        public async Task<int> UpdateUserDetailsAsync(UserDetailUpdateDto dto, IFormFile? file = null)
        {
            UserDetail? ud = await context.UserDetails.FirstOrDefaultAsync(u => u.Id == dto.Id);
            if (ud == null)
                return -1;

            ud.Address = dto.Address;
            ud.Fullname = dto.Fullname;
            ud.Phone = dto.Phone;
            ud.UserId = dto.UserId;

            if (dto.PhotoUrl != null && dto.PhotoUrl.Length > 0 && ud.PhotoUrl.Trim().ToLower() != dto.PhotoUrl.Trim().ToLower())
            {
                ud.PhotoUrl = dto.PhotoUrl;
                photoService.DeletePhoto(ud.PhotoUrl);
            }

            if (file != null && file.Length > 0)
                ud.PhotoUrl = await photoService.SavePhotoAsync(file);

            int res = await context.SaveChangesAsync();
            return (res == 0) ? ud.Id : res;
        }

        public async Task<UserDetailViewDto?> GetUserDetailsAsync(int id)
        {
            return await context.UserDetails
            .AsNoTracking()
            .Where(u => u.Id == id)
            .Select(ud => new UserDetailViewDto(ud.Id)
            {
                Address = ud.Address,
                Fullname = ud.Fullname,
                PhotoUrl = ud.PhotoUrl,
                Phone = ud.Phone,
                UserId = ud.UserId,
                CreatedAt = ud.CreatedAt.ToShortDateString()
            })
            .FirstOrDefaultAsync();
        }

        public async Task<IList<UserDetailViewDto>> GetAllUserDetailsAsync()
        {
            return await context.UserDetails.AsNoTracking()
                .Select(ud => new UserDetailViewDto(ud.Id)
                {
                    Address = ud.Address,
                    Fullname = ud.Fullname,
                    PhotoUrl = ud.PhotoUrl,
                    Phone = ud.Phone,
                    UserId = ud.UserId,
                    CreatedAt = ud.CreatedAt.ToShortDateString()
                }).ToListAsync();
        }

        public async Task<int> DeleteUserDetailsAsync(int userId)
        {
            UserDetail? ud = await context.UserDetails.FirstOrDefaultAsync(u => u.UserId == userId);
            if (ud == null)
                return -1;

            context.UserDetails.Remove(ud);
            return await context.SaveChangesAsync();
        }

        public async Task<int> UserResetPasswordAsync(UserPasswordChangeDto dto)
        {
            User? user = await context.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);
            if (user == null)
                return -1;

            user.PasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            return await context.SaveChangesAsync();
        }

        public async Task<UserDetailViewDto?> GetUserDetailsByUserIdAsync(int userId)
        {
            UserDetail? ud = await context.UserDetails.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
            if (ud == null)
            {
                return new UserDetailViewDto(0)
                {
                    UserId = userId
                };
            }

            return new UserDetailViewDto(ud.Id)
            {
                Address = ud.Address,
                Fullname = ud.Fullname,
                PhotoUrl = ud.PhotoUrl,
                Phone = ud.Phone,
                UserId = userId,
                CreatedAt = ud.CreatedAt.ToShortDateString()
            };
        }
    }
}
