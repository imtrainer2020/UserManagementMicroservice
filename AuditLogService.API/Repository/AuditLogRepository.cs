using AuditLogService.API.Data;
using AuditLogService.API.Models;
using Shared.CL;
using Shared.CL.DTOs;

namespace AuditLogService.API.Repository
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly AuditLogDbContext context;

        public AuditLogRepository(AuditLogDbContext _context)
        {
            context = _context;
        }
        public async Task<int> AddAuditLogAsync(AuditLogDto dto)
        {
            AuditLog log = new AuditLog
            {
                UserId = dto.UserId,
                UserEmail = dto.UserEmail,
                Action = dto.Action,
                ServiceName = dto.ServiceName,
                IsError = dto.IsError,
                ErrorMessage = dto.ErrorMessage
            };
            await context.AuditLogs.AddAsync(log);
            await context.SaveChangesAsync();

            return log.Id;
        }
    }
}
