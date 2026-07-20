namespace RigForge.Core.Entities;

public class GpuDetail
{
    public int EkranKartiID { get; set; }
    public int UrunID { get; set; }
    public int BellekGB { get; set; }
    public string? BellekTipi { get; set; }
    public int? TDP { get; set; }
    public int? MinimumPSUWatt { get; set; }

    public Product? Urun { get; set; }
}