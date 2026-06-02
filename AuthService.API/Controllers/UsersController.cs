using AuthService.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.CL;
using Shared.CL.DTOs;
using Shared.CL.Enums;
using Shared.CL.Filters;

namespace AuthService.API.Controllers;

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
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<int>>> RegisterUser([FromBody] UserRegisterDto dto)
    {
        int res = await repo.RegisterUserAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "User registered successfully."));
            case -1:
                return BadRequest(ApiResponse<int>.Fail("User - " + dto.Email + " already exists."));
            default:
                return BadRequest(ApiResponse<int>.Fail("An error occurred while adding the User."));
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoggedUserDto>>> LoginUser([FromBody] UserLoginDto dto)
    {
        LoggedUserDto loggedUser = await repo.LoginUserAsync(dto);
        return (loggedUser != null && loggedUser.JwtToken != null && loggedUser.JwtToken.Length > 0) ?
            Ok(ApiResponse<LoggedUserDto>.Success(loggedUser, "Login successful."))
        : BadRequest(ApiResponse<LoggedUserDto>.Fail("Invalid Email or Password"));
    }

    [HttpGet("forgetpassword")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<bool>>> ForgetPassword([FromQuery] string email)
    {
        bool isEmailExist = await repo.ForgetPasswordAsync(email);
        return (isEmailExist) ? Ok(ApiResponse<bool>.Success(isEmailExist, "Email exists."))
            : BadRequest(ApiResponse<bool>.Fail("Email does not exist."));
    }

    [RoleAuthorize]
    [HttpPut("update")]
    public async Task<ActionResult<ApiResponse<int>>> UpdateUser([FromBody] UserEditDto dto)
    {
        int res = await repo.UpdateUserAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "User updated successfully."));
            case -1:
                return BadRequest(ApiResponse<int>.Fail("User - " + dto.Email + " already exists."));
            default:
                return BadRequest(ApiResponse<int>.Fail("An error occurred while updating the User."));
        }
    }

    [HttpPut("resetpassword")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<int>>> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        int res = await repo.ResetPasswordAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "Password reset successfully."));
            case -1:
                return NotFound(ApiResponse<int>.Fail("User - " + dto.Email + " Not Found."));
            default:
                return BadRequest(ApiResponse<int>.Fail("Password reset failed."));
        }
    }

    [HttpPut("resetuserrole")]
    [RoleAuthorize(RolesEnum.Admin)]
    public async Task<ActionResult<ApiResponse<int>>> ChangeUserRoles([FromBody] ChangeUserRolesDto dto)
    {
        int res = await repo.ChangeUserRolesAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "User role changed successfully."));
            case -1:
                return NotFound(ApiResponse<int>.Fail("User - " + dto.Email + " Not Found."));
            default:
                return BadRequest(ApiResponse<int>.Fail("Failed to change user role."));
        }
    }

    [RoleAuthorize]
    [HttpDelete("delete")]
    public async Task<ActionResult<ApiResponse<int>>> DeleteUser([FromBody] UserDeleteDto dto)
    {
        int res = await repo.DeleteUserAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "User deleted successfully."));
            case -1:
                return NotFound(ApiResponse<int>.Fail("User - " + dto.Email + " Not Found."));
            default:
                return BadRequest(ApiResponse<int>.Fail("User deletion failed."));
        }
    }

    [RoleAuthorize]
    [HttpGet("list")]
    public async Task<ActionResult<ApiResponse<IList<UserViewDto>>>> ListUsers()
    {
        IList<UserViewDto> users = await repo.GetAllUsersAsync();
        return (users != null && users.Count > 0) ?
            Ok(ApiResponse<IList<UserViewDto>>.Success(users, "Users listed successfully."))
            : NotFound(ApiResponse<IList<UserViewDto>>.Fail("No users found."));
    }

    [HttpPost("createuser")]
    [RoleAuthorize(RolesEnum.Admin, RolesEnum.Manager)]
    public async Task<ActionResult<ApiResponse<int>>> CreateUser([FromBody] UserRegisterDto dto)
    {
        int res = await repo.RegisterUserAsync(dto);
        switch (res)
        {
            case > 0:
                return Ok(ApiResponse<int>.Success(res, "User registered successfully."));
            case -1:
                return BadRequest(ApiResponse<int>.Fail("User - " + dto.Email + " not found."));
            default:
                return BadRequest(ApiResponse<int>.Fail("An error occurred while adding the User."));
        }
    }

    [RoleAuthorize]
    [HttpGet("view")]
    public async Task<ActionResult<ApiResponse<UserViewDto>>> ViewUser([FromQuery] int? id, [FromQuery] string? email)
    {
        UserViewDto user = await repo.ViewUserAsync(id, email);
        if (user != null)
        {
            switch (user.Id)
            {
                case > 0:
                    return Ok(ApiResponse<UserViewDto>.Success(user, "User viewed successfully."));
                case -1:
                    return BadRequest(ApiResponse<UserViewDto>.Fail("User - " + email + " not found."));
                default:
                    return BadRequest(ApiResponse<UserViewDto>.Fail("An error occurred while adding the User."));
            }
        }
        else
            return BadRequest(ApiResponse<UserViewDto>.Fail("Invalid request. Please provide either a valid user ID or email."));
    }
}
