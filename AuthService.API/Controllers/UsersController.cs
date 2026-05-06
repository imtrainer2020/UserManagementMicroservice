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
        var result = await repo.RegisterUserAsync(dto);
        return (result.IsSuccess) ? Ok(result) : BadRequest(result);
    }
}
