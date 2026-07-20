namespace RigForge.Core.Entities;

public class Cart
{
    public int SepetID { get; set; }
    public int KullaniciID { get; set; }
    public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
    public DateTime GuncellemeTarihi { get; set; } = DateTime.Now;

    public ICollection<CartItem> SepetDetaylari { get; set; } = new List<CartItem>();
}