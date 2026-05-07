using AuthService.API.Data;
using AuthService.API.Repository;
using Microsoft.EntityFrameworkCore;
using Shared.CL.Filters;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AuthDbConnectionString") ?? throw new InvalidOperationException("Connection string 'AuthDbConnectionString' not found.");

builder.Services.AddDbContext<AuthDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddScoped<IAuthRepository, AuthRepository>();

// Register HttpClient so the filter can use it
builder.Services.AddHttpClient();

builder.Services.AddControllers(options =>
{
    // Register the global filter
    options.Filters.Add<GlobalExceptionFilter>();
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
