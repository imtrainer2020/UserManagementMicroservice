using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Shared.CL.DTOs;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Shared.CL.Filters
{
    public class ActivityLogFilter : IAsyncActionFilter
    {
        private readonly ILogger<ActivityLogFilter> logger;
        private readonly HttpClient httpClient;
        private readonly string serviceName;
        private readonly string auditLogApiUrl;

        public ActivityLogFilter(
            ILogger<ActivityLogFilter> _logger,
            HttpClient _httpClient,
            IConfiguration _config)
        {
            logger = _logger;
            httpClient = _httpClient;
            serviceName = _config["ServiceName"] ?? "UnknownService";
            auditLogApiUrl = _config["AuditLogApiUrl"] ?? "http://localhost:5298/api/auditlogs";
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            string payload = string.Empty;
            if (context.ActionArguments.Any())
            {
                try
                {
                    // Serialize the input parameters into a JSON string
                    payload = JsonSerializer.Serialize(context.ActionArguments);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to serialize action arguments for audit log.");
                    payload = "Serialization Failed";
                }
            }

            var resultContext = await next();

            if (resultContext.Exception != null || resultContext.ExceptionHandled)
                return;

            ClaimsPrincipal user = context.HttpContext.User;
            string? userIdClaim = null;
            string? emailClaim = null;

            // FIX: Ensure the user is actually authenticated before digging for claims
            if (user.Identity != null && user.Identity.IsAuthenticated)
            {
                // FIX: Fallback to simple string keys if Microsoft's ClaimTypes are not found
                userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? user.FindFirst("id")?.Value
                           ?? user.FindFirst("nameid")?.Value
                           ?? user.FindFirst("UserId")?.Value;

                emailClaim = user.FindFirst(ClaimTypes.Email)?.Value
                          ?? user.FindFirst("email")?.Value;
            }

            int? userId = int.TryParse(userIdClaim, out var id) ? id : null;

            // STEP 2: Format the string to include the service name and the payload
            string combinedServiceAndPayload = string.IsNullOrEmpty(payload)
                ? serviceName
                : $"{serviceName} | Payload: {payload}";

            // BUILDING THE LOG RECORD
            AuditLogCreateDto auditLog = new AuditLogCreateDto
            {
                UserId = userId,
                UserEmail = emailClaim,
                // Captures the HTTP Verb and the URL path (e.g., "POST /api/roles")
                Action = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}",
                ServiceName = combinedServiceAndPayload,
                IsError = false, // This filter only handles successful/normal requests
                ErrorMessage = null
            };

            // SENDING THE LOG TO THE MICROSERVICE
            try
            {
                string json = JsonSerializer.Serialize(auditLog);
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                // We send the POST request to the centralized AuditLogService
                await httpClient.PostAsync(auditLogApiUrl, content);
            }
            catch (Exception ex)
            {
                // If the AuditLog service is offline, we write to the local console 
                // so the main API doesn't crash and the user experience isn't ruined.
                logger.LogWarning(ex, "FAILED to send activity log to AuditLogService.API.");
            }
        }
    }
}
