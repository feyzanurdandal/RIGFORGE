using System.ComponentModel.DataAnnotations.Schema;

namespace RigForge.Core.Entities;

public class OrderItem
{
    public int SiparisDetayID { get; set; }
    public int SiparisID { get; set; }
    public int UrunID { get; set; }
    public int Adet { get; set; }
    public decimal BirimFiyat { get; set; }

    // Navigation Properties
    public Order? Siparis { get; set; }

    [ForeignKey("UrunID")]
    public Product? Urun { get; set; } // Hatanın çözümü için bu navigation property şart!
}