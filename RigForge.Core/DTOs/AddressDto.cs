namespace RigForge.Core.DTOs;

public class AddressDto
{
    public int AdresID { get; set; }
    public string AdresBasligi { get; set; } = string.Empty;
    public string Il { get; set; } = string.Empty;
    public string Ilce { get; set; } = string.Empty;
    public string AcikAdres { get; set; } = string.Empty;
    public string? PostaKodu { get; set; }
}
