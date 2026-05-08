using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.DTOs
{
    public record AuditLogCreateDto
    {
        public int? UserId { get; init; }
        public string? UserEmail { get; init; }
        public string Action { get; init; } = null!;
        public string ServiceName { get; init; } = null!;
        public bool IsError { get; init; } = true;
        public string? ErrorMessage { get; init; }
    }

    public record AuditLogListDto : AuditLogCreateDto
    {
        public DateTime CreatedAt { get; init; }
    }
}
