using BeerStore.API.Models.Entities;

namespace BeerStore.API.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart?> GetByUserIdAsync(int userId);
        Task<Cart> CreateAsync(Cart cart);
        Task<Cart> UpdateAsync(Cart cart);
        Task<CartItem?> GetCartItemAsync(int cartId, int beerId);
        Task<CartItem> AddItemAsync(CartItem item);
        Task<CartItem> UpdateItemAsync(CartItem item);
        Task DeleteItemAsync(int itemId);
        Task ClearCartAsync(int cartId);
    }
}
