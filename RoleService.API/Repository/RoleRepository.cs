using RoleService.API.Data;
using RoleService.API.Models;
using Shared.CL;
using Shared.CL.DTOs.RolesDto;

namespace RoleService.API.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly RoleDbContext context;

        public RoleRepository(RoleDbContext _context)
        {
            this.context = _context;
        }
        public async Task<int> AddRoleAsync(RoleCreateDto dto)
        {
            await context.Roles.AddAsync(new Role { RoleName = dto.RoleName });
            return await context.SaveChangesAsync();
        }
    }
}
