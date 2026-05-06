using Shared.CL;
using Shared.CL.DTOs;

namespace AuditLogService.API.Repository
{
    public interface IAuditLogRepository
    {
        public Task<ApiResponse<int>> AddAuditLogAsync(AuditLogDto dto);
    }
}
