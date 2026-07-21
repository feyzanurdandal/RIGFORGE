using System.ComponentModel.DataAnnotations.Schema;

namespace RigForge.Core.Entities;

public class CartItem
{
    public int SepetDetayID { get; set; }

    [ForeignKey("Sepet")]
    public int SepetID { get; set; } // SQL'deki gerçek Foreign Key adı

    public int UrunID { get; set; }
    public int Adet { get; set; }

    // Navigation Properties
    public Cart? Sepet { get; set; }
    public Product? Urun { get; set; }
}