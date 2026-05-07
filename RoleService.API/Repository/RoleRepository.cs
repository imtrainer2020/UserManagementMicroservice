using RoleService.API.Data;
using RoleService.API.Models;
using Shared.CL;
using Shared.CL.DTOs.RolesDto;
using Microsoft.EntityFrameworkCore;

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
            bool isRoleExist = await context.Roles.AnyAsync(r => r.RoleName == dto.RoleName);
            if (!isRoleExist)
            {
                var role = new Role
                {
                    RoleName = dto.RoleName,
                };
                await context.Roles.AddAsync(role);
                await context.SaveChangesAsync();
                return role.Id;
            }
            else
                return -1;
        }
    }
}
