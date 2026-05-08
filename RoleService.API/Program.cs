using Shared.CL.Filters;
using Microsoft.EntityFrameworkCore;
using RoleService.API.Data;
using RoleService.API.Repository;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("RoleDbConnectionString") ?? throw new InvalidOperationException("Connection string 'RoleDbConnectionString' not found.");

builder.Services.AddDbContext<RoleDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddScoped<IRoleRepository, RoleRepository>();

// Register HttpClient so the filter can use it
builder.Services.AddHttpClient();

builder.Services.AddControllers(options =>
{
    // Register the global filter
    options.Filters.Add<GlobalExceptionFilter>();

    // Log successful activities and endpoint hits
    options.Filters.Add<ActivityLogFilter>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
