using Shared.CL;
using Shared.CL.DTOs;

namespace UserService.API.Repository
{
    public interface IUserDetailsRepository
    {
        public Task<int> AddUserDetailsAsync(UserDetailCreateDto dto);
        public Task<int> UpdateUserDetailsAsync(UserDetailUpdateDto dto);
        public Task<int> DeleteUserDetailsAsync(int id);
        public Task<UserDetailViewDto?> GetUserDetailsAsync(int id);
        public Task<IList<UserDetailViewDto>> GetAllUserDetailsAsync();
        public Task<int> UserResetPasswordAsync(UserResetPasswordDto dto);
    }
}
