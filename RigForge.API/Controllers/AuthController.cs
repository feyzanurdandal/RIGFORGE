using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RigForge.Core.DTOs;
using RigForge.Core.Entities;
using RigForge.Infrastructure.Data;

namespace RigForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Kullanicilar.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Bu e-posta adresi zaten kullanımda." });

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Sifre);

        var user = new User
        {
            Ad = dto.Ad,
            Soyad = dto.Soyad,
            KullaniciAdi = string.IsNullOrEmpty(dto.KullaniciAdi) ? dto.Email : dto.KullaniciAdi,
            Email = dto.Email,
            Sifre = hashedPassword,
            Telefon = dto.Telefon,
            KayitTarihi = DateTime.Now,
            Rol = "Kullanici"
        };

        _context.Kullanicilar.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Kayıt başarıyla tamamlandı." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Kullanicilar.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Sifre, user.Sifre))
            return Unauthorized(new { message = "E-posta veya şifre hatalı." });

        var token = GenerateJwtToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            AdSoyad = $"{user.Ad} {user.Soyad}",
            Rol = user.Rol,
            Telefon = user.Telefon
        });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSecret = _configuration["Jwt:Secret"] ?? "RigForge_Super_Secret_Key_2026_VBT_Project_Key_123456!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.KullaniciID.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.Ad} {user.Soyad}"),
            new Claim(ClaimTypes.Role, user.Rol)
        };

        var token = new JwtSecurityToken(
            issuer: "RigForgeAPI",
            audience: "RigForgeUser",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}