using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoleService.API.Data;
using RoleService.API.Models;
using RoleService.API.Repository;
using Shared.CL;
using Shared.CL.DTOs.RolesDto;

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
        var result = await repo.CreateRoleAsync(dto);
        return (result!=null && result.IsSuccess) ? Ok(result) : BadRequest(result);
    }
}
