namespace RigForge.Core.Entities;

public class Adres
{
    public int AdresID { get; set; }
    public int KullaniciID { get; set; }
    public string AdresBasligi { get; set; } = string.Empty;
    public string Il { get; set; } = string.Empty;
    public string Ilce { get; set; } = string.Empty;
    public string AcikAdres { get; set; } = string.Empty;
    public string? PostaKodu { get; set; }

    // Navigation Property
    public User? Kullanici { get; set; }
}