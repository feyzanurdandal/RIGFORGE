using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RigForge.Core.DTOs;
using RigForge.Core.Entities;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/stats
    // Dashboard üzerindeki temel istatistik metriklerini getirir
    [HttpGet("stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var toplamGelir = await _context.Siparisler
            .Where(o => o.OdemeDurumu == "Odendi")
            .SumAsync(o => (decimal?)o.ToplamTutar) ?? 0;

        var toplamSiparis = await _context.Siparisler.CountAsync();
        var toplamKullanici = await _context.Kullanicilar.CountAsync();
        var dusukStok = await _context.Urunler.CountAsync(p => p.Stok <= 5 && p.AktifMi);

        return Ok(new AdminDashboardStatsDto
        {
            ToplamGelir = toplamGelir,
            ToplamSiparis = toplamSiparis,
            ToplamKullanici = toplamKullanici,
            DusukStokUrunSayisi = dusukStok
        });
    }

    // POST: api/admin/products
    // Admin panelinden yeni ürün ekleme
    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UrunAdi))
            return BadRequest(new { message = "Ürün adı zorunludur." });
        if (dto.Fiyat <= 0)
            return BadRequest(new { message = "Fiyat sıfırdan büyük olmalıdır." });
        if (dto.Stok < 0)
            return BadRequest(new { message = "Stok negatif olamaz." });
        if (dto.KategoriID <= 0 || dto.MarkaID <= 0)
            return BadRequest(new { message = "Kategori ve marka bilgisi geçersiz." });

        var product = new Product
        {
            UrunAdi = dto.UrunAdi.Trim(),
            Aciklama = dto.Aciklama,
            Fiyat = dto.Fiyat,
            Stok = dto.Stok,
            ResimURL = dto.ResimURL,
            KategoriID = dto.KategoriID,
            MarkaID = dto.MarkaID,
            AktifMi = true,
            OlusturmaTarihi = DateTime.Now
        };

        try
        {
            _context.Urunler.Add(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Ürün başarıyla eklendi.", urunId = product.UrunID });
        }
        catch (DbUpdateException)
        {
            return BadRequest(new
            {
                message = "Ürün veritabanına eklenemedi. Seçilen kategori veya marka veritabanında bulunmuyor olabilir."
            });
        }
    }

    // GET: api/admin/orders
    // Yönetim paneli için tüm siparişleri listeler
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Siparisler
            .OrderByDescending(o => o.SiparisTarihi)
            .Select(o => new
            {
                o.SiparisID,
                o.KullaniciID,
                o.SiparisTarihi,
                o.ToplamTutar,
                o.SiparisDurumu,
                o.OdemeDurumu
            })
            .ToListAsync();

        return Ok(orders);
    }

    // PUT: api/admin/orders/status
    // Sipariş durumunu günceller (Örn: Kargoya verildi)
    [HttpPut("orders/status")]
    public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _context.Siparisler.FindAsync(dto.SiparisID);
        if (order == null)
            return NotFound(new { message = "Sipariş bulunamadı." });

        order.SiparisDurumu = dto.YeniDurum;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Sipariş durumu güncellendi." });
    }
}