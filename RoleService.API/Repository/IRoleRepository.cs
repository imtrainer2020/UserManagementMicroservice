using Shared.CL;
using Shared.CL.DTOs.RolesDto;

namespace RoleService.API.Repository
{
    public interface IRoleRepository
    {
        public Task<int> AddRoleAsync(RoleCreateDto dto);
    }
}
