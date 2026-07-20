using Microsoft.EntityFrameworkCore;
using RigForge.Core.Entities;

namespace RigForge.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Urunler { get; set; }
    public DbSet<User> Kullanicilar { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().ToTable("Urunler").HasKey(p => p.UrunID);
        
        modelBuilder.Entity<User>().ToTable("Kullanicilar").HasKey(u => u.KullaniciID);
    }
}