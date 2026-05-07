using Microsoft.AspNetCore.Mvc;
using AuditLogService.API.Repository;
using Shared.CL;
using Shared.CL.DTOs.AuditDto;

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
        ApiResponse<int> result = await repo.AddAuditLogAsync(dto);
        return (result.IsSuccess) ? Ok(result) : BadRequest(result);
    }
}
