using Shared.CL;
using Shared.CL.DTOs.UserDetailDto;

namespace UserService.API.Repository
{
    public interface IUserDetailsRepository
    {
        public Task<ApiResponse<int>> AddUserDetailsAsync(UserDetailCreateDto dto);
    }
}
