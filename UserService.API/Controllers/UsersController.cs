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
        int res = await repo.AddUserDetailsAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User details added successfully."))
            : Ok(ApiResponse<int>.Fail("Failed to add user details."));
    }

}
