using Microsoft.AspNetCore.Mvc;
using RoleService.API.Repository;
using Shared.CL;
using Shared.CL.DTOs;
using Shared.CL.Enums;
using Shared.CL.Filters;

namespace RoleService.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[RoleAuthorize(RolesEnum.Admin, RolesEnum.Manager)]
public class RolesController : ControllerBase
{
    private readonly IRoleRepository repo;
    public RolesController(IRoleRepository _repo)
    {
        repo = _repo;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<int>>> CreateRole(RoleCreateDto dto)
    {
        int res = await repo.AddRoleAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "Role added successfully."));
            case -1:
                return BadRequest(ApiResponse<int>.Fail("Role " + dto.RoleName + " already exists."));
            default:
                return BadRequest(ApiResponse<int>.Fail("An error occurred while adding the role."));
        }
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IList<RoleViewDto>>>> GetAllRoles()
    {
        IList<RoleViewDto> roles = await repo.GetAllRolesAsync();
        return (roles != null && roles.Count > 0) ?
         Ok(ApiResponse<IList<RoleViewDto>>.Success(roles, "Roles retrieved successfully."))
         : NotFound(ApiResponse<IList<RoleViewDto>>.Fail("No roles found."));
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse<int>>> UpdateRole(RoleUpdateDto dto)
    {
        int res = await repo.UpdateRoleAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "Role updated successfully."));
            case -1:
                return NotFound(ApiResponse<int>.Fail("Role not found."));
            default:
                return BadRequest(ApiResponse<int>.Fail("An error occurred while updating the role."));
        }
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse<int>>> DeleteRole(int id)
    {
        int res = await repo.DeleteRoleAsync(id);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "Role deleted successfully."));
            case -1:
                return NotFound(ApiResponse<int>.Fail("Role not found."));
            default:
                return BadRequest(ApiResponse<int>.Fail("An error occurred while deleting the role."));
        }
    }

    [HttpGet("id")]
    public async Task<ActionResult<ApiResponse<RoleViewDto?>>> GetRoleById(int id)
    {
        RoleViewDto? role = await repo.GetRoleByIdAsync(id);
        return (role != null) ?
         Ok(ApiResponse<RoleViewDto>.Success(role, "Role retrieved successfully."))
         : NotFound(ApiResponse<RoleViewDto>.Fail("Role not found."));
    }
}
