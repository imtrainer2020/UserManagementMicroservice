using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using RoleService.API.Models;

namespace RoleService.API.Data;

public partial class RoleDbContext : DbContext
{
    public RoleDbContext()
    {
    }

    public RoleDbContext(DbContextOptions<RoleDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Role> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC074FDEF211");

            entity.HasIndex(e => e.RoleName, "UQ__Roles__8A2B6160B594E396").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleName).HasMaxLength(25);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
