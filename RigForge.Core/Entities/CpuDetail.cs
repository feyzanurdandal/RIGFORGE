namespace RigForge.Core.Entities;

public class CpuDetail
{
    public int IslemciID { get; set; }
    public int UrunID { get; set; }
    public string Soket { get; set; } = string.Empty;
    public int CekirdekSayisi { get; set; }
    public int IzlekSayisi { get; set; }
    public decimal? TemelFrekans { get; set; }
    public decimal? BoostFrekans { get; set; }
    public int? TDP { get; set; }

    public Product? Urun { get; set; }
}