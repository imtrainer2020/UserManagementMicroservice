using Microsoft.EntityFrameworkCore;
using Shared.CL;
using Shared.CL.DTOs;
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

        public async Task<int> AddUserDetailsAsync(UserDetailCreateDto dto)
        {
            var ud = new UserDetail
            {
                Address = dto.Address,
                Fullname = dto.Fullname,
                PhotoUrl = dto.PhotoUrl,
                Phone = dto.Phone,
                UserId = dto.UserId
            };
            await context.UserDetails.AddAsync(ud);
            await context.SaveChangesAsync();

            return ud.Id;
        }

        public async Task<int> UpdateUserDetailsAsync(UserDetailUpdateDto dto)
        {
            UserDetail? ud = await context.UserDetails.FirstOrDefaultAsync(u => u.Id == dto.Id);
            if (ud == null)
                throw new Exception("User detail not found");

            ud.Address = dto.Address;
            ud.Fullname = dto.Fullname;
            ud.PhotoUrl = dto.PhotoUrl;
            ud.Phone = dto.Phone;
            ud.UserId = dto.UserId;

            return await context.SaveChangesAsync();
        }

        public async Task<UserDetailViewDto?> GetUserDetailsAsync(int id)
        {
            UserDetail? ud = await context.UserDetails.FirstOrDefaultAsync(u => u.Id == id);
            if (ud == null)
                throw new Exception("User detail not found");

            return new UserDetailViewDto(ud.Id)
            {
                Address = ud.Address,
                Fullname = ud.Fullname,
                PhotoUrl = ud.PhotoUrl,
                Phone = ud.Phone,
                UserId = ud.UserId
            };
        }

        public async Task<IList<UserDetailViewDto>> GetAllUserDetailsAsync()
        {
            IList<UserDetail> userDetailsService = await context.UserDetails.ToListAsync();
            return userDetailsService.Select(ud => new UserDetailViewDto(ud.Id)
            {
                Address = ud.Address,
                Fullname = ud.Fullname,
                PhotoUrl = ud.PhotoUrl,
                Phone = ud.Phone,
                UserId = ud.UserId
            }).ToList();
        }

        public async Task<int> DeleteUserDetailsAsync(int id)
        {
            UserDetail? ud = await context.UserDetails.FirstOrDefaultAsync(u => u.Id == id);
            if (ud == null)
                throw new Exception("User detail not found");

            context.UserDetails.Remove(ud);
            return await context.SaveChangesAsync();
        }

        public async Task<int> UserResetPasswordAsync(UserPasswordChangeDto dto)
        {
            User? user = await context.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);
            if (user == null)
                throw new Exception("User not found");

            user.PasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            return await context.SaveChangesAsync();
        }
    }
}
