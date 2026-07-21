namespace RigForge.Core.DTOs;

public class AddToCartDto
{
    public int KullaniciID { get; set; }
    public int UrunID { get; set; }
    public int Adet { get; set; } = 1;
}