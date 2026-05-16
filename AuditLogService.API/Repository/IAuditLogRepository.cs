using Shared.CL;
using Shared.CL.DTOs;

namespace AuditLogService.API.Repository
{
    public interface IAuditLogRepository
    {
        public Task<int> AddAuditLogAsync(AuditLogCreateDto dto);
        public Task<IList<AuditLogListDto>> GetAuditLogsAsync();
        public Task<IList<AuditLogListDto>> GetAuditLogsByUserIdAsync(int userId);
    }
}
