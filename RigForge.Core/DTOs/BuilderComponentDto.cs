namespace RigForge.Core.DTOs;

public class BuilderComponentDto
{
    public int UrunID { get; set; }
    public string UrunAdi { get; set; } = string.Empty;
    public decimal Fiyat { get; set; }
    public string? ResimURL { get; set; }
    public int KategoriID { get; set; }
    public string? Soket { get; set; }
    public int? Wattage { get; set; }
    public int? BellekGB { get; set; }
}