using BeerStore.API.Models.DTOs.Cart;

namespace BeerStore.API.Services.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> GetCartAsync(int userId);
        Task<CartDto> AddToCartAsync(int userId, AddToCartDto model);
        Task<CartDto> UpdateCartItemAsync(int userId, int itemId, UpdateCartItemDto model);
        Task<CartDto> RemoveFromCartAsync(int userId, int itemId);
        Task ClearCartAsync(int userId);
    }
}
