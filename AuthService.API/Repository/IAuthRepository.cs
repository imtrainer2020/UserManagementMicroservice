using Shared.CL;
using Shared.CL.DTOs;

namespace AuthService.API.Repository
{
    public interface IAuthRepository
    {
        public Task<ApiResponse<int>> RegisterUserAsync(UserRegisterDto dto);
    }
}
