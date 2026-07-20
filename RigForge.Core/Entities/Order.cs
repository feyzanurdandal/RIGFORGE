namespace RigForge.Core.Entities;

public class Order
{
    public int SiparisID { get; set; }
    public int KullaniciID { get; set; }
    public int AdresID { get; set; }
    public DateTime SiparisTarihi { get; set; } = DateTime.Now;
    public decimal ToplamTutar { get; set; }
    public string SiparisDurumu { get; set; } = "Hazirlaniyor";
    public string OdemeYontemi { get; set; } = "Kredi Karti";
    public string OdemeDurumu { get; set; } = "Odendi";
    public decimal KuponTutari { get; set; } = 0;

    public ICollection<OrderItem> SiparisDetaylari { get; set; } = new List<OrderItem>();
}