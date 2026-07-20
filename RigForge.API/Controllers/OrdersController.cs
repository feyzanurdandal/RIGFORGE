using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RigForge.Core.DTOs;
using RigForge.Core.Entities;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
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
        var cart = await _context.Sepetler
            .Include(c => c.SepetDetaylari)
            .ThenInclude(ci => ci.Urun)
            .FirstOrDefaultAsync(c => c.KullaniciID == dto.KullaniciID);

        if (cart == null || !cart.SepetDetaylari.Any())
            return BadRequest(new { message = "Sepetinizde ürün bulunmamaktadır." });

        decimal toplamTutar = cart.SepetDetaylari.Sum(ci => (ci.Urun?.Fiyat ?? 0) * ci.Adet);

        var order = new Order
        {
            KullaniciID = dto.KullaniciID,
            AdresID = dto.AdresID,
            SiparisTarihi = DateTime.Now,
            ToplamTutar = toplamTutar,
            SiparisDurumu = "Hazirlaniyor",
            OdemeYontemi = dto.OdemeYontemi,
            OdemeDurumu = "Odendi"
        };

        foreach (var item in cart.SepetDetaylari)
        {
            order.SiparisDetaylari.Add(new OrderItem
            {
                UrunID = item.UrunID,
                Adet = item.Adet,
                BirimFiyat = item.Urun?.Fiyat ?? 0
            });
        }

        _context.Siparisler.Add(order);
        _context.SepetDetaylari.RemoveRange(cart.SepetDetaylari); // Sepeti temizle
        await _context.SaveChangesAsync();

        return Ok(new { message = "Siparişiniz başarıyla oluşturuldu.", orderId = order.SiparisID });
    }
}