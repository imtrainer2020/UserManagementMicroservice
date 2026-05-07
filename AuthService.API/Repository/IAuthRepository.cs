using Shared.CL;
using Shared.CL.DTOs;

namespace AuthService.API.Repository
{
    public interface IAuthRepository
    {
        public Task<int> RegisterUserAsync(UserRegisterDto dto);
        public Task<string> LoginUserAsync(UserLoginDto dto);
    }
}
