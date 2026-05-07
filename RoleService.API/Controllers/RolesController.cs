using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoleService.API.Repository;
using Shared.CL;
using Shared.CL.DTOs;

[Route("api/[controller]")]
[ApiController]
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
                return Ok(ApiResponse<int>.Fail("Role " + dto.RoleName + " already exists."));
            default:
                return Ok(ApiResponse<int>.Fail("An error occurred while adding the role."));
        }
    }
}
