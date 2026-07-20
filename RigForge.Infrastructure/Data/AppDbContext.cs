using Microsoft.EntityFrameworkCore;
using RigForge.Core.Entities;

namespace RigForge.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Urunler { get; set; }
    public DbSet<User> Kullanicilar { get; set; }
    public DbSet<Cart> Sepetler { get; set; }
    public DbSet<CartItem> SepetDetaylari { get; set; }
    public DbSet<Order> Siparisler { get; set; }
    public DbSet<OrderItem> SiparisDetaylari { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().ToTable("Urunler").HasKey(p => p.UrunID);
        modelBuilder.Entity<User>().ToTable("Kullanicilar").HasKey(u => u.KullaniciID);
        
        // Sepet İlişkileri
        modelBuilder.Entity<Cart>().ToTable("Sepetler").HasKey(c => c.SepetID);
        modelBuilder.Entity<CartItem>().ToTable("SepetDetaylari").HasKey(ci => ci.SepetDetayID);
        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Urun)
            .WithMany()
            .HasForeignKey(ci => ci.UrunID);

        // Sipariş İlişkileri
        modelBuilder.Entity<Order>().ToTable("Siparisler").HasKey(o => o.SiparisID);
        modelBuilder.Entity<OrderItem>().ToTable("SiparisDetaylari").HasKey(oi => oi.SiparisDetayID);
    }
}