namespace RigForge.Core.DTOs;

public class UpdateOrderStatusDto
{
    public int SiparisID { get; set; }
    public string YeniDurum { get; set; } = string.Empty;
}