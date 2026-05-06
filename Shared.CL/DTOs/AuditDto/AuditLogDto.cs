using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.DTOs.AuditDto
{
    public class AuditLogDto
    {
        //public int Id { get; set; }
        public int? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string Action { get; set; } = null!;
        public string ServiceName { get; set; } = null!;
        public bool IsError { get; set; } = true;
        public string? ErrorMessage { get; set; }
    }
}
