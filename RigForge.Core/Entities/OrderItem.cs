namespace RigForge.Core.Entities;

public class OrderItem
{
    public int SiparisDetayID { get; set; }
    public int SiparisID { get; set; }
    public int UrunID { get; set; }
    public int Adet { get; set; }
    public decimal BirimFiyat { get; set; }
}