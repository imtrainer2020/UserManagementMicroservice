using Shared.CL;
using Shared.CL.DTOs;

namespace RoleService.API.Repository
{
    public interface IRoleRepository
    {
        public Task<int> AddRoleAsync(RoleCreateDto dto);
    }
}
