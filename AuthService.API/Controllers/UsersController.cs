using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthService.API.Models;
using AuthService.API.Data;
using AuthService.API.Repository;
using Shared.CL;
using Shared.CL.DTOs.AuthDto;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IAuthRepository repo;
    public UsersController(IAuthRepository _repo)
    {
        repo = _repo;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<int>>> RegisterUser([FromBody] UserRegisterDto dto)
    {
        try
        {
            return Ok(ApiResponse<int>
                .Success(
                    await repo.RegisterUserAsync(dto),
                    "User registered successfully.")
                );
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<int>.Fail(ex.InnerException?.Message ?? ex.Message));
        }
    }
}
