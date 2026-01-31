namespace BeerStore.API.Models.DTOs.Auth
{
    public class AuthResponseDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime TokenExpiration { get; set; }
        public string? RefreshToken { get; set; }
    }
}
