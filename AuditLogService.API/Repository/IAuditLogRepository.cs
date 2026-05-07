using Shared.CL;
using Shared.CL.DTOs.AuditDto;

namespace AuditLogService.API.Repository
{
    public interface IAuditLogRepository
    {
        public Task<int> AddAuditLogAsync(AuditLogDto dto);
    }
}
