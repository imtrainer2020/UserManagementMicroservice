using AuthService.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.CL;
using Shared.CL.DTOs;
using Shared.CL.Enums;
using Shared.CL.Filters;

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
        try
        {
            int res = await repo.RegisterUserAsync(dto);
            return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User registered successfully."))
                : Ok(ApiResponse<int>.Fail("User registration failed."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.Fail(ex.Message));
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoggedUserDto>>> LoginUser([FromBody] UserLoginDto dto)
    {
        try
        {
            LoggedUserDto loggedUser = await repo.LoginUserAsync(dto);
            return Ok(ApiResponse<LoggedUserDto>.Success(loggedUser, "Login successful."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<LoggedUserDto>.Fail(ex.Message));
        }
    }

    [HttpPost("forgetpassword")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<bool>>> ForgetPassword([FromBody] string email)
    {
        try
        {
            bool isEmailExist = await repo.ForgetPasswordAsync(email);
            return (isEmailExist) ? Ok(ApiResponse<bool>.Success(isEmailExist, "Email exists."))
                : Ok(ApiResponse<bool>.Fail("Email does not exist."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<bool>.Fail(ex.Message));
        }
    }

    [RoleAuthorize]
    [HttpPut("update")]
    public async Task<ActionResult<ApiResponse<int>>> UpdateUser([FromBody] UserEditDto dto)
    {
        int res = await repo.UpdateUserAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User updated successfully."))
            : Ok(ApiResponse<int>.Fail("User update failed."));
    }

    [HttpPost("resetpassword")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<int>>> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        try
        {
            int res = await repo.ResetPasswordAsync(dto);
            return (res > 0) ? Ok(ApiResponse<int>.Success(res, "Password reset successfully."))
                : Ok(ApiResponse<int>.Fail("Password reset failed."));
        }
        catch (Exception ex)
        {
            return Ok(ApiResponse<int>.Fail(ex.Message));
        }
    }

    [HttpPost("resetuserrole")]
    [RoleAuthorize(RolesEnum.Admin)]
    public async Task<ActionResult<ApiResponse<int>>> ChangeUserRoles([FromBody] ChangeUserRolesDto dto)
    {
        int res = await repo.ChangeUserRolesAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User role changed successfully."))
            : Ok(ApiResponse<int>.Fail("Failed to change user role."));
    }

    [RoleAuthorize]
    [HttpDelete("delete")]
    public async Task<ActionResult<ApiResponse<int>>> DeleteUser([FromBody] UserDeleteDto dto)
    {
        int res = await repo.DeleteUserAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User deleted successfully."))
            : Ok(ApiResponse<int>.Fail("User deletion failed."));
    }

    [RoleAuthorize]
    [HttpGet("list")]
    public async Task<ActionResult<ApiResponse<IList<UserListDto>>>> ListUsers()
    {
        IList<UserListDto> users = await repo.GetAllUsersAsync();
        return (users != null && users.Count > 0) ?
            Ok(ApiResponse<IList<UserListDto>>.Success(users, "Users listed successfully."))
            : Ok(ApiResponse<IList<UserListDto>>.Fail("No users found."));
    }

    [RoleAuthorize]
    [HttpGet("view")]
    public async Task<ActionResult<ApiResponse<UserViewDto>>> ViewUser([FromQuery] int? id, [FromQuery] string? email)
    {
        UserViewDto user = await repo.ViewUserAsync(id, email);
        return (user != null && user.Id > 1) ?
            Ok(ApiResponse<UserViewDto>.Success(user, "User viewed successfully."))
            : Ok(ApiResponse<UserViewDto>.Fail("User not found."));
    }
}
