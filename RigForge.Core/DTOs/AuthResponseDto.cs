namespace RigForge.Core.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string AdSoyad { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}