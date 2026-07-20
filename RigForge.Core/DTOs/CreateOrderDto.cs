namespace RigForge.Core.DTOs;

public class CreateOrderDto
{
    public int KullaniciID { get; set; }
    public int AdresID { get; set; } = 1; // Varsayılan adres ID
    public string OdemeYontemi { get; set; } = "Kredi Karti";
}