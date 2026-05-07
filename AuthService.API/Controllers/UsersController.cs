using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthService.API.Models;
using AuthService.API.Data;
using AuthService.API.Repository;
using Shared.CL;
using Shared.CL.DTOs;

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
        int res = await repo.RegisterUserAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User registered successfully."))
            : Ok(ApiResponse<int>.Fail("User registration failed."));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<string>>> LoginUser([FromBody] UserLoginDto dto)
    {
        string token = await repo.LoginUserAsync(dto);
        return Ok(ApiResponse<string>.Success(token, "Login successful."));
    }
}
