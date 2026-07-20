using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RigForge.Core.DTOs;
using RigForge.Core.Entities;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var cart = await _context.Sepetler
            .Include(c => c.SepetDetaylari)
            .ThenInclude(ci => ci.Urun)
            .FirstOrDefaultAsync(c => c.KullaniciID == userId);

        if (cart == null)
            return Ok(new { message = "Sepet boş.", items = new List<object>() });

        var result = cart.SepetDetaylari.Select(ci => new
        {
            ci.SepetDetayID,
            ci.UrunID,
            UrunAdi = ci.Urun?.UrunAdi,
            Fiyat = ci.Urun?.Fiyat,
            ResimURL = ci.Urun?.ResimURL,
            ci.Adet,
            ToplamTutar = (ci.Urun?.Fiyat ?? 0) * ci.Adet
        });

        return Ok(result);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        var cart = await _context.Sepetler
            .Include(c => c.SepetDetaylari)
            .FirstOrDefaultAsync(c => c.KullaniciID == dto.KullaniciID);

        if (cart == null)
        {
            cart = new Cart
            {
                KullaniciID = dto.KullaniciID,
                OlusturmaTarihi = DateTime.Now,
                GuncellemeTarihi = DateTime.Now
            };
            _context.Sepetler.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existingItem = cart.SepetDetaylari.FirstOrDefault(ci => ci.UrunID == dto.UrunID);
        if (existingItem != null)
        {
            existingItem.Adet += dto.Adet;
        }
        else
        {
            cart.SepetDetaylari.Add(new CartItem
            {
                SepetID = cart.SepetID,
                UrunID = dto.UrunID,
                Adet = dto.Adet
            });
        }

        cart.GuncellemeTarihi = DateTime.Now;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Ürün sepete eklendi." });
    }
}