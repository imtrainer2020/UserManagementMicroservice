using Shared.CL;
using Shared.CL.DTOs;

namespace RoleService.API.Repository
{
    public interface IRoleRepository
    {
        public Task<int> AddRoleAsync(RoleCreateDto dto);
        public Task<int> DeleteRoleAsync(int id);
        public Task<int> UpdateRoleAsync(RoleUpdateDto dto);
        public Task<IList<RoleViewDto>> GetAllRolesAsync();
        public Task<RoleViewDto?> GetRoleByIdAsync(int id);
    }
}
