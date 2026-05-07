using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.CL;
using Shared.CL.DTOs.RolesDto;
using Shared.CL.DTOs.UserDetailDto;
using UserService.API.Data;
using UserService.API.Models;
using UserService.API.Repository;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserDetailsRepository repo;
    public UsersController(IUserDetailsRepository _repo)
    {
        repo = _repo;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<int>>> AddUserDetails(UserDetailCreateDto dto)
    {
        var result = await repo.AddUserDetailsAsync(dto);
        return (result.IsSuccess) ? Ok(result) : BadRequest(result);
    }

}
