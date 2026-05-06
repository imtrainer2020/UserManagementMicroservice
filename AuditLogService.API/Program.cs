using AuditLogService.API.Data;
using AuditLogService.API.Repository;
using Microsoft.EntityFrameworkCore;
using Shared.CL.Filters;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AuditLogDbConnectionString") ?? throw new InvalidOperationException("Connection string 'AuditLogDbConnectionString' not found.");

builder.Services.AddDbContext<AuditLogDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

// Register HttpClient so the filter can use it
builder.Services.AddHttpClient();

builder.Services.AddControllers(options =>
{
    // Register the global filter
    options.Filters.Add<GlobalExceptionFilter>();
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
