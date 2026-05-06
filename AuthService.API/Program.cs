using Shared.CL.Filters;
using Microsoft.EntityFrameworkCore;
using AuthService.API.Data;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AuthDbContext") ?? throw new InvalidOperationException("Connection string 'AuthDbContext' not found.");

builder.Services.AddDbContext<AuthDbContext>(options => options.UseSqlServer(connectionString));

// Add services to the container.

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
