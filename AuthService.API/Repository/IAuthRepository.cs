using Shared.CL;
using Shared.CL.DTOs.AuthDto;

namespace AuthService.API.Repository
{
    public interface IAuthRepository
    {
        public Task<ApiResponse<int>> RegisterUserAsync(UserRegisterDto dto);
    }
}
