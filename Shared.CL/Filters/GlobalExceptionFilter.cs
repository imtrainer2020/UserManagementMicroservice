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
        private readonly ILogger<GlobalExceptionFilter> logger;
        private readonly HttpClient httpClient;
        private readonly string serviceName;
        private readonly string auditLogApiUrl;

        public GlobalExceptionFilter(
            ILogger<GlobalExceptionFilter> _logger,
            HttpClient _httpClient,
            IConfiguration _config)
        {
            logger = _logger;
            httpClient = _httpClient;

            // Read from appsettings.json of whichever API is currently running
            serviceName = _config["ServiceName"] ?? "UnknownService";
            auditLogApiUrl = _config["AuditLogApiUrl"] ?? "http://localhost:5298/api/auditlogs";
        }
        public async Task OnExceptionAsync(ExceptionContext context)
        {
            logger.LogError(context.Exception, "Unhandled exception occurred in {ServiceName}", serviceName);

            // 1. Attempt to extract User details if the request was authenticated
            ClaimsPrincipal user = context.HttpContext.User;
            string? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            string? emailClaim = user.FindFirst(ClaimTypes.Email)?.Value;

            int? userId = int.TryParse(userIdClaim, out var id) ? id : null;

            // 2. Build the Audit Log Payload based on your DB schema requirements
            AuditLogCreateDto auditLog = new AuditLogCreateDto
            {
                UserId = userId,
                UserEmail = emailClaim,
                Action = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}",
                ServiceName = serviceName,
                IsError = true,
                ErrorMessage = context.Exception.Message // Sends full stack trace to the DB
            };

            // 3. Send the log to the AuditLogService.API
            try
            {
                string json = JsonSerializer.Serialize(auditLog);
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                await httpClient.PostAsync(auditLogApiUrl, content);
            }
            catch (Exception ex)
            {
                // If the Audit Service is down, log to the local console/file so the error isn't lost
                logger.LogCritical(ex, "FAILED to send audit log to AuditLogService.API.");
            }

            // 4. Return your standardized ApiResponse to the frontend
            ApiResponse<object> response = ApiResponse<object>.Fail("An unexpected error occurred. Our technical team has been notified.");
            context.Result = new ObjectResult(response) { StatusCode = 500 };
            context.ExceptionHandled = true;
        }
    }
}
