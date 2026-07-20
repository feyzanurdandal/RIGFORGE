// using System.Security.Claims;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using RigForge.Core.DTOs;
// using RigForge.Core.Entities;
// using RigForge.Infrastructure.Data;

// namespace RigForge.API.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// [Authorize] // Sadece geçerli JWT Token sahipleri erişebilir
// public class OrdersController : ControllerBase
// {
//     private readonly AppDbContext _context;

//     public OrdersController(AppDbContext context)
//     {
//         _context = context;
//     }

//     [HttpPost("checkout")]
//     public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
//     {
//         if (!ModelState.IsValid)
//             return BadRequest(ModelState);

//         // Güvenlik: Kullanıcı ID bilgisi client'tan DEĞİL, cryptographically signed JWT Token'dan çekilir.
//         var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//         if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int authenticatedUserId))
//         {
//             return Unauthorized(new { message = "Geçersiz veya süresi dolmuş kimlik doğrulaması. Lütfen tekrar giriş yapın." });
//         }

//         // Kullanıcının veritabanında varlığı kontrol edilir
//         var userExists = await _context.Kullanicilar.AnyAsync(u => u.KullaniciID == authenticatedUserId);
//         if (!userExists)
//         {
//             return Unauthorized(new { message = "Kullanıcı hesabı bulunamadı." });
//         }

//         // Sepet kontrolü
//         var cart = await _context.Sepetler
//             .Include(c => c.SepetDetaylari)
//             .ThenInclude(ci => ci.Urun)
//             .FirstOrDefaultAsync(c => c.KullaniciID == authenticatedUserId);

//         if (cart == null || !cart.SepetDetaylari.Any())
//         {
//             return BadRequest(new { message = "Sepetinizde sipariş verilecek ürün bulunmamaktadır." });
//         }

//         decimal toplamTutar = cart.SepetDetaylari.Sum(ci => (ci.Urun?.Fiyat ?? 0) * ci.Adet);

//         if (toplamTutar <= 0)
//         {
//             return BadRequest(new { message = "Sipariş tutarı geçersizdir." });
//         }

//         // Sipariş Nesnesi Oluşturma
//         var order = new Order
//         {
//             KullaniciID = authenticatedUserId, // Doğrulanmış JWT kullanıcısı
//             AdresID = dto.AdresID,
//             SiparisTarihi = DateTime.Now,
//             ToplamTutar = toplamTutar,
//             SiparisDurumu = "Hazirlaniyor",
//             OdemeYontemi = dto.OdemeYontemi,
//             OdemeDurumu = "Odendi",
//             KuponTutari = 0
//         };

//         foreach (var item in cart.SepetDetaylari)
//         {
//             order.SiparisDetaylari.Add(new OrderItem
//             {
//                 UrunID = item.UrunID,
//                 Adet = item.Adet,
//                 BirimFiyat = item.Urun?.Fiyat ?? 0
//             });
//         }

//         // Transaction Yönetimi ile Güvenli Veritabanı Kaydı
//         using var transaction = await _context.Database.BeginTransactionAsync();
//         try
//         {
//             _context.Siparisler.Add(order);
//             _context.SepetDetaylari.RemoveRange(cart.SepetDetaylari); // Sepeti temizle
//             await _context.SaveChangesAsync();
//             await transaction.CommitAsync();

//             return Ok(new { message = "Siparişiniz başarıyla oluşturuldu.", orderId = order.SiparisID });
//         }
//         catch (Exception)
//         {
//             await transaction.RollbackAsync();
//             return StatusCode(500, new { message = "Sipariş işlenirken sunucu tarafında bir hata oluştu." });
//         }
//     }
// }


using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RigForge.Core.DTOs;
using RigForge.Core.Entities;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
    {
        try
        {
            // 1. Cryptographically Signed JWT Token'dan Kullanıcı ID'sini Çek
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int authenticatedUserId))
            {
                return Unauthorized(new { message = "Geçersiz kimlik doğrulaması. Lütfen tekrar giriş yapın." });
            }

            // 2. Kullanıcının Veritabanı Varlığını Kontrol Et
            var user = await _context.Kullanicilar.FirstOrDefaultAsync(u => u.KullaniciID == authenticatedUserId);
            if (user == null)
            {
                return Unauthorized(new { message = "Kullanıcı kaydı bulunamadı." });
            }

            // 3. Adres Kontrolü (SQL [dbo].[Adresler] Şemana ve AppDbContext'e Tam Uyumlu)
            var address = await _context.Adresler.FirstOrDefaultAsync(a => a.KullaniciID == authenticatedUserId);
            int validAddressId;

            if (address == null)
            {
                var newAddress = new Adres
                {
                    KullaniciID = authenticatedUserId,
                    AdresBasligi = "Ev Adresi",
                    Il = "Kütahya",
                    Ilce = "Merkez",
                    AcikAdres = "Kullanıcı Varsayılan Profil Adresi",
                    PostaKodu = "43000"
                };
                
                _context.Adresler.Add(newAddress);
                await _context.SaveChangesAsync();
                validAddressId = newAddress.AdresID;
            }
            else
            {
                validAddressId = address.AdresID;
            }

            // 4. Sepet ve Sipariş Süreci
            // OrdersController.cs -> Checkout metodu içindeki 4. Adım (Sipariş Tutar Hesabı)

            var cart = await _context.Sepetler
                .Include(c => c.SepetDetaylari)
                .ThenInclude(ci => ci.Urun)
                .FirstOrDefaultAsync(c => c.KullaniciID == authenticatedUserId);

            // 1. Öncelik: DB Sepetindeki gerçek tutar
            // 2. Öncelik: DB boşsa DTO'dan (Frontend/PC Builder) gelen gerçek sepet tutarı
            decimal dbCartTotal = cart?.SepetDetaylari?.Sum(ci => (ci.Urun?.Fiyat ?? 0) * ci.Adet) ?? 0;
            decimal finalTotal = dbCartTotal > 0 ? dbCartTotal : dto.ToplamTutar;

            if (finalTotal <= 0)
            {
                return BadRequest(new { message = "Sipariş tutarı 0 veya negatif olamaz." });
            }

            var order = new Order
            {
                KullaniciID = authenticatedUserId,
                AdresID = validAddressId,
                SiparisTarihi = DateTime.Now,
                ToplamTutar = finalTotal, // Artık 15000 değil, tam hesaplanan gerçek tutar!
                SiparisDurumu = "Hazirlaniyor",
                OdemeYontemi = string.IsNullOrEmpty(dto.OdemeYontemi) ? "Kredi Karti" : dto.OdemeYontemi,
                OdemeDurumu = "Odendi",
                KuponTutari = 0
            };

            if (cart != null && cart.SepetDetaylari.Any())
            {
                foreach (var item in cart.SepetDetaylari)
                {
                    order.SiparisDetaylari.Add(new OrderItem
                    {
                        UrunID = item.UrunID,
                        Adet = item.Adet,
                        BirimFiyat = item.Urun?.Fiyat ?? 0
                    });
                }
                _context.SepetDetaylari.RemoveRange(cart.SepetDetaylari);
            }

            _context.Siparisler.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Siparişiniz başarıyla veritabanına işlendi.", orderId = order.SiparisID });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                message = "Sipariş oluşturulurken sunucu hatası oluştu.", 
                error = ex.Message, 
                inner = ex.InnerException?.Message 
            });
        }
    }

[HttpGet("my-orders")]
public async Task<IActionResult> GetMyOrders()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int authenticatedUserId))
    {
        return Unauthorized(new { message = "Geçersiz kimlik doğrulaması." });
    }

    var orders = await _context.Siparisler
        .Include(o => o.SiparisDetaylari)
        .ThenInclude(sd => sd.Urun)
        .Where(o => o.KullaniciID == authenticatedUserId)
        .OrderByDescending(o => o.SiparisTarihi)
        .Select(o => new
        {
            orderId = o.SiparisID,
            orderNo = $"RF-{o.SiparisID}",
            date = o.SiparisTarihi.ToString("dd.MM.yyyy HH:mm"),
            status = o.SiparisDurumu,
            total = o.ToplamTutar,
            items = o.SiparisDetaylari.Select(sd => new
            {
                productName = sd.Urun != null ? sd.Urun.UrunAdi : "Sistem Bileşeni",
                quantity = sd.Adet,
                price = sd.BirimFiyat
            }).ToList()
        })
        .ToListAsync();

    return Ok(orders);
}
}