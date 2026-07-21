using System.ComponentModel.DataAnnotations;

namespace RigForge.Core.DTOs;

public class CreateOrderDto
{
    [Required(ErrorMessage = "Adres seçimi zorunludur.")]
    [Range(1, int.MaxValue, ErrorMessage = "Geçersiz Adres ID.")]
    public int AdresID { get; set; } = 1;

    [Required(ErrorMessage = "Ödeme yöntemi zorunludur.")]
    [StringLength(50, ErrorMessage = "Ödeme yöntemi en fazla 50 karakter olabilir.")]
    public string OdemeYontemi { get; set; } = "Kredi Karti";

    // Dynamic Total Amount from Client (PC Builder & Local Storage Cart support)
    [Range(0.01, double.MaxValue, ErrorMessage = "Geçersiz sipariş tutarı.")]
    public decimal ToplamTutar { get; set; }
}