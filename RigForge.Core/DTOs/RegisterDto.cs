namespace RigForge.Core.DTOs;

public class RegisterDto
{
    public string Ad { get; set; } = string.Empty;
    public string Soyad { get; set; } = string.Empty;
    public string KullaniciAdi { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
    public string? Telefon { get; set; }
}