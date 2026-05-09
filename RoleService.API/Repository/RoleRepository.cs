using RoleService.API.Data;
using RoleService.API.Models;
using Shared.CL;
using Microsoft.EntityFrameworkCore;
using Shared.CL.DTOs;

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

        public async Task<int> DeleteRoleAsync(int id)
        {
            Role? role = await context.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (role != null)
            {
                context.Roles.Remove(role);
                return await context.SaveChangesAsync();
            }
            else
                throw new Exception("Role not found");
        }

        public async Task<IList<RoleViewDto>> GetAllRolesAsync()
        {
            return await context.Roles
                .Select(s => new RoleViewDto(s.Id, s.RoleName, s.CreatedAt))
                .ToListAsync();
        }

        public async Task<RoleViewDto?> GetRoleByIdAsync(int id)
        {
            RoleViewDto? role = await context.Roles
                .Where(r => r.Id == id)
                .Select(s => new RoleViewDto(s.Id, s.RoleName, s.CreatedAt))
                .FirstOrDefaultAsync();
            if (role == null)
                throw new Exception("Role not found");
            return role;
        }

        public async Task<int> UpdateRoleAsync(RoleUpdateDto dto)
        {
            Role? role = await context.Roles.FirstOrDefaultAsync(r => r.Id == dto.Id);
            if (role != null)
            {
                role.RoleName = dto.RoleName;
                return await context.SaveChangesAsync();
            }
            else
                throw new Exception("Role not found");
        }
    }
}
