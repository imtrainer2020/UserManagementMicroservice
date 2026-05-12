using Shared.CL;
using Shared.CL.DTOs;

namespace AuthService.API.Repository
{
    public interface IAuthRepository
    {
        public Task<IList<UserListDto>> GetAllUsersAsync();
        public Task<int> RegisterUserAsync(UserRegisterDto dto);
        public Task<bool> ForgetPasswordAsync(string email);
        public Task<LoggedUserDto> LoginUserAsync(UserLoginDto dto);
        public Task<int> UpdateUserAsync(UserEditDto dto);
        public Task<int> ResetPasswordAsync(ResetPasswordDto dto);
        public Task<int> DeleteUserAsync(UserDeleteDto dto);
        public Task<int> ChangeUserRolesAsync(ChangeUserRolesDto dto);
        public Task<UserViewDto> ViewUserAsync(int? id, string? email);
    }
}
