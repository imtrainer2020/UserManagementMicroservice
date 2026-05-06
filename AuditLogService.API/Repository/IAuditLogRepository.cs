using Shared.CL;

namespace AuditLogService.API.Repository
{
    public interface IAuditLogRepository
    {
        public Task<ApiResponse<AuditLog>> AddAuditLogAsync(AuditLog auditLog);
    }
}
