using AuditLogService.API.Data;
using AuditLogService.API.Repository;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AuditLogDbConnectionString") ?? throw new InvalidOperationException("Connection string 'AuditLogDbConnectionString' not found.");

builder.Services.AddDbContext<AuditLogDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
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
