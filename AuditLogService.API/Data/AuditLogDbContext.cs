using System;
using System.Collections.Generic;
using AuditLogService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuditLogService.API.Data;

public partial class AuditLogDbContext : DbContext
{
    public AuditLogDbContext()
    {
    }

    public AuditLogDbContext(DbContextOptions<AuditLogDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        => optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=MS_AuditLog;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AuditLog__3214EC079E2920F3");

            entity.Property(e => e.Action).HasMaxLength(200);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ServiceName).HasMaxLength(100);
            entity.Property(e => e.UserEmail).HasMaxLength(200);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
