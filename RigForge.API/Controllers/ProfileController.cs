using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RigForge.Core.DTOs;
using RigForge.Core.Entities;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfileController(AppDbContext context)
    {
        _context = context;
    }

    private int? CurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var id) ? id : null;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = CurrentUserId();
        if (userId is null) return Unauthorized();

        var user = await _context.Kullanicilar.AsNoTracking()
            .FirstOrDefaultAsync(x => x.KullaniciID == userId.Value);
        if (user is null) return NotFound(new { message = "Kullanıcı bulunamadı." });

        return Ok(new
        {
            name = $"{user.Ad} {user.Soyad}".Trim(),
            email = user.Email,
            phone = user.Telefon ?? string.Empty,
            role = user.Rol
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = CurrentUserId();
        if (userId is null) return Unauthorized();

        var name = (dto.AdSoyad ?? string.Empty).Trim();
        var email = (dto.Email ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email))
            return BadRequest(new { message = "Ad soyad ve e-posta zorunludur." });

        var emailInUse = await _context.Kullanicilar
            .AnyAsync(x => x.Email == email && x.KullaniciID != userId.Value);
        if (emailInUse)
            return BadRequest(new { message = "Bu e-posta başka bir kullanıcı tarafından kullanılıyor." });

        var user = await _context.Kullanicilar.FindAsync(userId.Value);
        if (user is null) return NotFound(new { message = "Kullanıcı bulunamadı." });

        var parts = name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        user.Ad = parts[0];
        user.Soyad = parts.Length > 1 ? string.Join(" ", parts.Skip(1)) : string.Empty;
        user.Email = email;
        user.Telefon = string.IsNullOrWhiteSpace(dto.Telefon) ? null : dto.Telefon.Trim();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Bilgiler kaydedildi.",
            name = $"{user.Ad} {user.Soyad}".Trim(),
            email = user.Email,
            phone = user.Telefon ?? string.Empty,
            role = user.Rol
        });
    }

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = CurrentUserId();
        if (userId is null) return Unauthorized();

        var addresses = await _context.Adresler.AsNoTracking()
            .Where(x => x.KullaniciID == userId.Value)
            .OrderByDescending(x => x.AdresID)
            .Select(x => new AddressDto
            {
                AdresID = x.AdresID,
                AdresBasligi = x.AdresBasligi,
                Il = x.Il,
                Ilce = x.Ilce,
                AcikAdres = x.AcikAdres,
                PostaKodu = x.PostaKodu
            })
            .ToListAsync();

        return Ok(addresses);
    }

    [HttpPost("addresses")]
    public async Task<IActionResult> CreateAddress([FromBody] AddressDto dto)
    {
        var userId = CurrentUserId();
        if (userId is null) return Unauthorized();
        if (!ValidAddress(dto, out var error)) return BadRequest(new { message = error });

        var address = new Adres
        {
            KullaniciID = userId.Value,
            AdresBasligi = dto.AdresBasligi.Trim(),
            Il = dto.Il.Trim(),
            Ilce = dto.Ilce.Trim(),
            AcikAdres = dto.AcikAdres.Trim(),
            PostaKodu = string.IsNullOrWhiteSpace(dto.PostaKodu) ? null : dto.PostaKodu.Trim()
        };

        _context.Adresler.Add(address);
        await _context.SaveChangesAsync();
        dto.AdresID = address.AdresID;
        return Ok(dto);
    }

    [HttpPut("addresses/{id:int}")]
    public async Task<IActionResult> UpdateAddress(int id, [FromBody] AddressDto dto)
    {
        var userId = CurrentUserId();
        if (userId is null) return Unauthorized();
        if (!ValidAddress(dto, out var error)) return BadRequest(new { message = error });

        var address = await _context.Adresler
            .FirstOrDefaultAsync(x => x.AdresID == id && x.KullaniciID == userId.Value);
        if (address is null) return NotFound(new { message = "Adres bulunamadı." });

        address.AdresBasligi = dto.AdresBasligi.Trim();
        address.Il = dto.Il.Trim();
        address.Ilce = dto.Ilce.Trim();
        address.AcikAdres = dto.AcikAdres.Trim();
        address.PostaKodu = string.IsNullOrWhiteSpace(dto.PostaKodu) ? null : dto.PostaKodu.Trim();
        await _context.SaveChangesAsync();
        dto.AdresID = address.AdresID;
        return Ok(dto);
    }

    [HttpDelete("addresses/{id:int}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var userId = CurrentUserId();
        if (userId is null) return Unauthorized();

        var address = await _context.Adresler
            .FirstOrDefaultAsync(x => x.AdresID == id && x.KullaniciID == userId.Value);
        if (address is null) return NotFound(new { message = "Adres bulunamadı." });

        _context.Adresler.Remove(address);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Adres silindi." });
    }

    private static bool ValidAddress(AddressDto dto, out string error)
    {
        if (string.IsNullOrWhiteSpace(dto.AdresBasligi) ||
            string.IsNullOrWhiteSpace(dto.Il) ||
            string.IsNullOrWhiteSpace(dto.Ilce) ||
            string.IsNullOrWhiteSpace(dto.AcikAdres))
        {
            error = "Adres başlığı, il, ilçe ve açık adres zorunludur.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}
