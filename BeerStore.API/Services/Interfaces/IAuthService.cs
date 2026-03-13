using BeerStore.API.Models.DTOs.Auth;

namespace BeerStore.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto model);
        Task<AuthResponseDto> LoginAsync(LoginDto model);
        Task<UserDto?> GetCurrentUserAsync(int userId);
        Task<UserDto> UpdateAddressAsync(int userId, UpdateAddressDto model);
        Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto model);
        Task ChangePasswordAsync(int userId, ChangePasswordDto model);
    }
}
