using Shared.CL;
using Shared.CL.DTOs;

namespace UserService.API.Repository
{
    public interface IUserDetailsRepository
    {
        public Task<int> AddUserDetailsAsync(UserDetailCreateDto dto, IFormFile? file = null);
        public Task<int> UpdateUserDetailsAsync(UserDetailUpdateDto dto, IFormFile? file = null);
        public Task<int> DeleteUserDetailsAsync(int id);
        public Task<UserDetailViewDto?> GetUserDetailsAsync(int id);
        public Task<UserDetailViewDto?> GetUserDetailsByUserIdAsync(int userId);
        public Task<IList<UserDetailViewDto>> GetAllUserDetailsAsync();
        public Task<int> UserResetPasswordAsync(UserPasswordChangeDto dto);
    }
}
