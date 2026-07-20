using Microsoft.EntityFrameworkCore;
using RigForge.Core.Entities;

namespace RigForge.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Urunler { get; set; }
    public DbSet<User> Kullanicilar { get; set; }
    public DbSet<Adres> Adresler { get; set; }
    public DbSet<Cart> Sepetler { get; set; }
    public DbSet<CartItem> SepetDetaylari { get; set; }
    public DbSet<Order> Siparisler { get; set; }
    public DbSet<OrderItem> SiparisDetaylari { get; set; }
    public DbSet<CpuDetail> IslemciOzellikleri { get; set; }
    public DbSet<GpuDetail> EkranKartiOzellikleri { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().ToTable("Urunler").HasKey(p => p.UrunID);
        modelBuilder.Entity<User>().ToTable("Kullanicilar").HasKey(u => u.KullaniciID);
        modelBuilder.Entity<Adres>().ToTable("Adresler").HasKey(a => a.AdresID);
        modelBuilder.Entity<Cart>().ToTable("Sepetler").HasKey(c => c.SepetID);
        
        // CartItem <-> Cart İlişkisini SQL Kolon Adıyla (SepetID) Eşleme
        modelBuilder.Entity<CartItem>()
            .ToTable("SepetDetaylari")
            .HasKey(ci => ci.SepetDetayID);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Sepet)
            .WithMany(c => c.SepetDetaylari)
            .HasForeignKey(ci => ci.SepetID); // EF Core'un 'CartSepetID' aramasını engeller

        modelBuilder.Entity<Order>().ToTable("Siparisler").HasKey(o => o.SiparisID);
        modelBuilder.Entity<OrderItem>().ToTable("SiparisDetaylari").HasKey(oi => oi.SiparisDetayID);

        // Sistem Toplama Parça İlişkileri
        modelBuilder.Entity<CpuDetail>().ToTable("IslemciOzellikleri").HasKey(c => c.IslemciID);
        modelBuilder.Entity<CpuDetail>().HasOne(c => c.Urun).WithMany().HasForeignKey(c => c.UrunID);

        modelBuilder.Entity<GpuDetail>().ToTable("EkranKartiOzellikleri").HasKey(g => g.EkranKartiID);
        modelBuilder.Entity<GpuDetail>().HasOne(g => g.Urun).WithMany().HasForeignKey(g => g.UrunID);
    }
}