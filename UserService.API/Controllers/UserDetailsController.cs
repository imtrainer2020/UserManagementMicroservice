using Microsoft.AspNetCore.Mvc;
using Shared.CL;
using Shared.CL.DTOs;
using Shared.CL.Filters;
using Shared.CL.Repository;
using UserService.API.Repository;

namespace UserService.API.Controllers
{
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

            return (userdetail != null && userdetail.Id > 0) ?
                Ok(ApiResponse<UserDetailViewDto>.Success(userdetail, "User Detail viewed successfully."))
                : Ok(ApiResponse<UserDetailViewDto>.Fail("User Detail not found."));
        }

        // GET: api/UserDetail/user/5
        [HttpGet("user/{userId:int}")]
        public async Task<ActionResult<ApiResponse<UserDetailViewDto?>>> GetUserDetailbyUserId(int userId)
        {
            UserDetailViewDto? userdetail = await repo.GetUserDetailsByUserIdAsync(userId);

            return (userdetail != null && userdetail.UserId > 0) ?
                Ok(ApiResponse<UserDetailViewDto>.Success(userdetail, "User Detail viewed successfully."))
                : Ok(ApiResponse<UserDetailViewDto>.Fail("User Detail not found."));
        }

        // PUT: api/UserDetail/5
        [HttpPut]
        public async Task<ActionResult<ApiResponse<int>>> PutUserDetail([FromForm] UserDetailUpdateDto dto, IFormFile? file = null)
        {
            int res = await repo.UpdateUserDetailsAsync(dto, file);
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
        public async Task<ActionResult<ApiResponse<int>>> PostUserDetail([FromForm] UserDetailCreateDto dto, IFormFile? file = null)
        {
            int res = await repo.AddUserDetailsAsync(dto, file);
            return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User details added successfully."))
                : Ok(ApiResponse<int>.Fail("Failed to add user details."));
        }

        // DELETE: api/UserDetail/5
        [HttpDelete("{userId:int}")]
        public async Task<ActionResult<ApiResponse<int>>> DeleteUserDetail(int userId)
        {
            int res = await repo.DeleteUserDetailsAsync(userId);
            return (res > 0) ? Ok(ApiResponse<int>.Success(res, "User detail deleted successfully."))
                : Ok(ApiResponse<int>.Fail("Failed to delete user detail."));
        }
    }
}