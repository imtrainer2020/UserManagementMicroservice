using AuditLogService.API.Data;
using AuditLogService.API.Models;
using Microsoft.EntityFrameworkCore;
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
        public async Task<int> AddAuditLogAsync(AuditLogCreateDto dto)
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
        public async Task<IList<AuditLogListDto>> GetAuditLogsAsync()
        {
            return await context.AuditLogs.AsNoTracking()
                .OrderByDescending(log => log.CreatedAt)
                .Select(log => new AuditLogListDto
                {
                    UserId = log.UserId,
                    UserEmail = log.UserEmail,
                    Action = log.Action,
                    ServiceName = log.ServiceName,
                    IsError = log.IsError,
                    ErrorMessage = log.ErrorMessage,
                    CreatedAt = log.CreatedAt
                }).ToListAsync();
        }
        public async Task<IList<AuditLogListDto>> GetAuditLogsByUserIdAsync(int userId)
        {
            return await context.AuditLogs
                .AsNoTracking()
                .Where(log => log.UserId == userId)
                .OrderByDescending(log => log.CreatedAt)
                .Select(log => new AuditLogListDto
                {
                    UserId = log.UserId,
                    UserEmail = log.UserEmail,
                    Action = log.Action,
                    ServiceName = log.ServiceName,
                    IsError = log.IsError,
                    ErrorMessage = log.ErrorMessage,
                    CreatedAt = log.CreatedAt
                }).ToListAsync();
        }
    }
}
