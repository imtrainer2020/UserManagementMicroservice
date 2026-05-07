using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text.Json;
using System.Text;
using Shared.CL.DTOs;

namespace Shared.CL.Filters
{
    public class GlobalExceptionFilter : IAsyncExceptionFilter
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _serviceName;
        private readonly string _auditLogApiUrl;

        public GlobalExceptionFilter(
            ILogger<GlobalExceptionFilter> logger,
            HttpClient httpClient,
            IConfiguration config)
        {
            _logger = logger;
            _httpClient = httpClient;

            // Read from appsettings.json of whichever API is currently running
            _serviceName = config["ServiceName"] ?? "UnknownService";
            _auditLogApiUrl = config["AuditLogApiUrl"] ?? "https://localhost:5001/api/auditlogs";
        }
        public async Task OnExceptionAsync(ExceptionContext context)
        {
            _logger.LogError(context.Exception, "Unhandled exception occurred in {ServiceName}", _serviceName);

            // 1. Attempt to extract User details if the request was authenticated
            var user = context.HttpContext.User;
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var emailClaim = user.FindFirst(ClaimTypes.Email)?.Value;

            int? userId = int.TryParse(userIdClaim, out var id) ? id : null;

            // 2. Build the Audit Log Payload based on your DB schema requirements
            var auditLog = new AuditLogDto
            {
                UserId = userId,
                UserEmail = emailClaim,
                Action = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}",
                ServiceName = _serviceName,
                IsError = true,
                ErrorMessage = context.Exception.ToString() // Sends full stack trace to the DB
            };

            // 3. Send the log to the AuditLogService.API
            try
            {
                var json = JsonSerializer.Serialize(auditLog);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                await _httpClient.PostAsync(_auditLogApiUrl, content);
            }
            catch (Exception ex)
            {
                // If the Audit Service is down, log to the local console/file so the error isn't lost
                _logger.LogCritical(ex, "FAILED to send audit log to AuditLogService.API.");
            }

            // 4. Return your standardized ApiResponse to the frontend
            var response = ApiResponse<object>.Fail("An unexpected error occurred. Our technical team has been notified.");
            context.Result = new ObjectResult(response) { StatusCode = 500 };
            context.ExceptionHandled = true;
        }
    }
}
