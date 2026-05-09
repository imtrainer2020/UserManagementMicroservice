using Microsoft.AspNetCore.Mvc;
using Shared.CL;
using Shared.CL.DTOs;
using Shared.CL.Filters;
using UserService.API.Repository;

[Route("api/[controller]")]
[ApiController]
[RoleAuthorize]
public class UserDetailsController : ControllerBase
{
    private readonly IUserDetailsRepository repo;
    public UserDetailsController(IUserDetailsRepository _repo)
    {
        repo = _repo;
    }

    // GET: api/UserDetail
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IList<UserDetailViewDto>>>> GetAllUserDetail()
    {
        IList<UserDetailViewDto> udList = await repo.GetAllUserDetailsAsync();
        return (udList != null && udList.Count > 0) ?
            Ok(ApiResponse<IList<UserDetailViewDto>>.Success(udList, "User Details listed successfully."))
            : Ok(ApiResponse<IList<UserDetailViewDto>>.Fail("No user details found."));
    }

    // GET: api/UserDetail/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserDetailViewDto?>>> GetUserDetail(int id)
    {
        UserDetailViewDto? userdetail = await repo.GetUserDetailsAsync(id);

        return (userdetail != null && userdetail.Id > 1) ?
            Ok(ApiResponse<UserDetailViewDto>.Success(userdetail, "User Detail viewed successfully."))
            : Ok(ApiResponse<UserDetailViewDto>.Fail("User Detail not found."));
    }

    // PUT: api/UserDetail/5
    [HttpPut]
    public async Task<ActionResult<ApiResponse<int>>> PutUserDetail(UserDetailUpdateDto dto)
    {
        int res = await repo.UpdateUserDetailsAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User details updated successfully."))
            : Ok(ApiResponse<int>.Fail("Failed to update user details."));
    }

    [HttpPut("resetpassword")]
    public async Task<ActionResult<ApiResponse<int>>> PutUserResetPassword(UserPasswordChangeDto dto)
    {
        int res = await repo.UserResetPasswordAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User password reset successfully."))
            : Ok(ApiResponse<int>.Fail("Failed to reset user password."));
    }

    // POST: api/UserDetail
    [HttpPost]
    public async Task<ActionResult<ApiResponse<int>>> PostUserDetail(UserDetailCreateDto dto)
    {
        int res = await repo.AddUserDetailsAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User details added successfully."))
            : Ok(ApiResponse<int>.Fail("Failed to add user details."));
    }

    // DELETE: api/UserDetail/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<int>>> DeleteUserDetail(int id)
    {
        int res = await repo.DeleteUserDetailsAsync(id);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User detail deleted successfully."))
            : Ok(ApiResponse<int>.Fail("Failed to delete user detail."));
    }

}
