namespace RigForge.Core.Entities;

public class Product
{
    public int UrunID { get; set; }
    public string UrunAdi { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public decimal Fiyat { get; set; }
    public int Stok { get; set; }
    public string? ResimURL { get; set; }
    public int KategoriID { get; set; }
    public int MarkaID { get; set; }
    public bool AktifMi { get; set; } = true;
    public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
}