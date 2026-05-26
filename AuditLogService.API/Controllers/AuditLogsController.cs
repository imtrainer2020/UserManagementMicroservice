using AuditLogService.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.CL;
using Shared.CL.DTOs;
using Shared.CL.Filters;

namespace AuditLogService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogsController : ControllerBase
    {
        private readonly IAuditLogRepository repo;
        public AuditLogsController(IAuditLogRepository _repo)
        {
            repo = _repo;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<int>>> AddAuditLog(AuditLogCreateDto dto)
        {
            int res = await repo.AddAuditLogAsync(dto);
            return (res > 0) ? Ok(ApiResponse<int>.Success(res, "Log registered successfully."))
                : Ok(ApiResponse<int>.Fail("Log registration failed."));
        }

        [HttpGet]
        [RoleAuthorize]
        public async Task<ActionResult<ApiResponse<IList<AuditLogListDto>>>> GetAuditLogs()
        {
            IList<AuditLogListDto> auditLogs = await repo.GetAuditLogsAsync();
            return (auditLogs != null && auditLogs.Count > 0) ?
                Ok(ApiResponse<IList<AuditLogListDto>>.Success(auditLogs, "Audit logs retrieved successfully."))
                : Ok(ApiResponse<IList<AuditLogListDto>>.Fail("No audit logs found."));
        }

        [HttpGet("user/{userId:int}")]
        [RoleAuthorize]
        public async Task<ActionResult<ApiResponse<IList<AuditLogListDto>>>> GetMyActivity(int userId)
        {
            IList<AuditLogListDto> auditLogs = await repo.GetAuditLogsByUserIdAsync(userId);
            return (auditLogs != null && auditLogs.Count > 0) ?
               Ok(ApiResponse<IList<AuditLogListDto>>.Success(auditLogs, "Audit logs retrieved successfully."))
               : Ok(ApiResponse<IList<AuditLogListDto>>.Fail("No audit logs found."));
        }
    }
}