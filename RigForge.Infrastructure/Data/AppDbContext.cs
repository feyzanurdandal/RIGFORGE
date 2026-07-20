using Microsoft.EntityFrameworkCore;
using RigForge.Core.Entities;

namespace RigForge.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Urunler { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Veritabanındaki tablo adını açıkça belirtiyoruz
        modelBuilder.Entity<Product>().ToTable("Urunler");
        modelBuilder.Entity<Product>().HasKey(p => p.UrunID);
    }
}