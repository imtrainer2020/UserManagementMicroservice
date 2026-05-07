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
        try
        {
            int res = await repo.AddUserDetailsAsync(dto);
            return Ok(ApiResponse<int>.Success(res, "User details added successfully."));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<int>.Fail(ex.InnerException?.Message ?? ex.Message));
        }
    }

}
