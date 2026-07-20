namespace RigForge.Core.DTOs;

public class ProductDto
{
    public int UrunID { get; set; }
    public string UrunAdi { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public decimal Fiyat { get; set; }
    public int Stok { get; set; }
    public string? ResimURL { get; set; }
    public int KategoriID { get; set; }
    public int MarkaID { get; set; }
}