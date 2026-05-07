using Shared.CL;
using Shared.CL.DTOs;

namespace UserService.API.Repository
{
    public interface IUserDetailsRepository
    {
        public Task<int> AddUserDetailsAsync(UserDetailCreateDto dto);
    }
}
