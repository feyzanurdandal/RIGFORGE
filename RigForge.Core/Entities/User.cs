namespace RigForge.Core.Entities;

public class User
{
    public int KullaniciID { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string Soyad { get; set; } = string.Empty;
    public string KullaniciAdi { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
    public string? Telefon { get; set; }
    public DateTime KayitTarihi { get; set; } = DateTime.Now;
    public string Rol { get; set; } = "Kullanici";
}