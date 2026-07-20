namespace RigForge.Core.Entities;

public class CartItem
{
    public int SepetDetayID { get; set; }
    public int SepetID { get; set; }
    public int UrunID { get; set; }
    public int Adet { get; set; } = 1;

    public Product? Urun { get; set; }
}