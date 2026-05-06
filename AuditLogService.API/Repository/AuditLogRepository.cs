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
        public async Task<ApiResponse<int>> AddAuditLogAsync(AuditLogDto dto)
        {
            try
            {
                await context.AuditLogs.AddAsync(new AuditLog
                {
                    UserId = dto.UserId,
                    UserEmail = dto.UserEmail,
                    Action = dto.Action,
                    ServiceName = dto.ServiceName,
                    IsError = dto.IsError,
                    ErrorMessage = dto.ErrorMessage,
                    CreatedAt = DateTime.UtcNow
                });
                return ApiResponse<int>.Success(await context.SaveChangesAsync());
            }
            catch (Exception ex)
            {
                return ApiResponse<int>.Fail(ex.Message);
            }
        }
    }
}
