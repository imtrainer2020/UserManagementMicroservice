using Microsoft.AspNetCore.Mvc;
using AuditLogService.API.Repository;
using Shared.CL;
using Shared.CL.DTOs;

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
    public async Task<ActionResult<ApiResponse<int>>> AddAuditLog(AuditLogDto dto)
    {
        int res = await repo.AddAuditLogAsync(dto);
        return (res > 0) ? Ok(ApiResponse<int>.Success(res, "Log registered successfully."))
            : Ok(ApiResponse<int>.Fail("Log registration failed."));

    }
}
