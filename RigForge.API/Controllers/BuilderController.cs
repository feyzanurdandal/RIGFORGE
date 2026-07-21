using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RigForge.Core.DTOs;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BuilderController : ControllerBase
{
    private readonly AppDbContext _context;

    public BuilderController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/builder/cpus
    // Sistem Toplama ekranındaki İşlemcileri soket filtresine göre getirir
    [HttpGet("cpus")]
    public async Task<IActionResult> GetCpus([FromQuery] string? socket)
    {
        var query = _context.IslemciOzellikleri
            .Include(c => c.Urun)
            .Where(c => c.Urun != null && c.Urun.AktifMi);

        if (!string.IsNullOrEmpty(socket) && socket.ToLower() != "all")
        {
            query = query.Where(c => c.Soket.ToLower() == socket.ToLower());
        }

        var list = await query.Select(c => new BuilderComponentDto
        {
            UrunID = c.UrunID,
            UrunAdi = c.Urun!.UrunAdi,
            Fiyat = c.Urun.Fiyat,
            ResimURL = c.Urun.ResimURL,
            KategoriID = c.Urun.KategoriID,
            Soket = c.Soket,
            Wattage = c.TDP
        }).ToListAsync();

        return Ok(list);
    }

    // GET: api/builder/gpus
    // Sistem Toplama ekranındaki Ekran Kartlarını getirir
    [HttpGet("gpus")]
    public async Task<IActionResult> GetGpus()
    {
        var list = await _context.EkranKartiOzellikleri
            .Include(g => g.Urun)
            .Where(g => g.Urun != null && g.Urun.AktifMi)
            .Select(g => new BuilderComponentDto
            {
                UrunID = g.UrunID,
                UrunAdi = g.Urun!.UrunAdi,
                Fiyat = g.Urun.Fiyat,
                ResimURL = g.Urun.ResimURL,
                KategoriID = g.Urun.KategoriID,
                Wattage = g.TDP,
                BellekGB = g.BellekGB
            }).ToListAsync();

        return Ok(list);
    }
}