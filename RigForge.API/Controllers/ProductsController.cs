using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RigForge.Core.DTOs;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    // Bütün ürünleri veya kategoriye göre filtrelenmiş ürünleri getirir
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] int? categoryId)
    {
        var query = _context.Urunler.Where(p => p.AktifMi);

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.KategoriID == categoryId.Value);
        }

        var products = await query.Select(p => new ProductDto
        {
            UrunID = p.UrunID,
            UrunAdi = p.UrunAdi,
            Aciklama = p.Aciklama,
            Fiyat = p.Fiyat,
            Stok = p.Stok,
            ResimURL = p.ResimURL,
            KategoriID = p.KategoriID,
            MarkaID = p.MarkaID
        }).ToListAsync();

        return Ok(products);
    }

    // GET: api/products/5
    // Tek bir ürünün detayını getirir
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _context.Urunler
            .Where(p => p.UrunID == id && p.AktifMi)
            .Select(p => new ProductDto
            {
                UrunID = p.UrunID,
                UrunAdi = p.UrunAdi,
                Aciklama = p.Aciklama,
                Fiyat = p.Fiyat,
                Stok = p.Stok,
                ResimURL = p.ResimURL,
                KategoriID = p.KategoriID,
                MarkaID = p.MarkaID
            })
            .FirstOrDefaultAsync();

        if (product == null)
            return NotFound(new { message = "Ürün bulunamadı." });

        return Ok(product);
    }
}