using BeerStore.API.Models.DTOs.Cart;
using BeerStore.API.Models.Entities;
using BeerStore.API.Repositories.Interfaces;
using BeerStore.API.Services.Interfaces;

namespace BeerStore.API.Services.Implementations
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IBeerRepository _beerRepository;

        public CartService(ICartRepository cartRepository, IBeerRepository beerRepository)
        {
            _cartRepository = cartRepository;
            _beerRepository = beerRepository;
        }

        public async Task<CartDto> GetCartAsync(int userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            
            if (cart == null)
            {
                // Create new cart if doesn't exist
                cart = await _cartRepository.CreateAsync(new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            return MapToCartDto(cart);
        }

        public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto model)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            
            if (cart == null)
            {
                cart = await _cartRepository.CreateAsync(new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            // Check if beer exists
            var beer = await _beerRepository.GetByIdAsync(model.BeerId);
            if (beer == null)
            {
                throw new KeyNotFoundException("Beer not found");
            }

            // Check if item already exists in cart
            var existingItem = await _cartRepository.GetCartItemAsync(cart.Id, model.BeerId);
            
            if (existingItem != null)
            {
                // Update quantity
                existingItem.Quantity += model.Quantity;
                await _cartRepository.UpdateItemAsync(existingItem);
            }
            else
            {
                // Add new item
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    BeerId = model.BeerId,
                    Quantity = model.Quantity,
                    PriceAtAdd = beer.Price,
                    AddedAt = DateTime.UtcNow
                };
                await _cartRepository.AddItemAsync(cartItem);
            }

            // Update cart timestamp
            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.UpdateAsync(cart);

            // Reload cart with items
            cart = await _cartRepository.GetByUserIdAsync(userId);
            return MapToCartDto(cart!);
        }

        public async Task<CartDto> UpdateCartItemAsync(int userId, int itemId, UpdateCartItemDto model)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart == null)
            {
                throw new KeyNotFoundException("Cart not found");
            }

            var item = cart.CartItems.FirstOrDefault(ci => ci.Id == itemId);
            if (item == null)
            {
                throw new KeyNotFoundException("Cart item not found");
            }

            item.Quantity = model.Quantity;
            await _cartRepository.UpdateItemAsync(item);

            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.UpdateAsync(cart);

            cart = await _cartRepository.GetByUserIdAsync(userId);
            return MapToCartDto(cart!);
        }

        public async Task<CartDto> RemoveFromCartAsync(int userId, int itemId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart == null)
            {
                throw new KeyNotFoundException("Cart not found");
            }

            await _cartRepository.DeleteItemAsync(itemId);

            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.UpdateAsync(cart);

            cart = await _cartRepository.GetByUserIdAsync(userId);
            return MapToCartDto(cart!);
        }

        public async Task ClearCartAsync(int userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart != null)
            {
                await _cartRepository.ClearCartAsync(cart.Id);
                
                cart.UpdatedAt = DateTime.UtcNow;
                await _cartRepository.UpdateAsync(cart);
            }
        }

        private static CartDto MapToCartDto(Cart cart)
        {
            var items = cart.CartItems?.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                BeerId = ci.BeerId,
                BeerName = ci.Beer.Name,
                BeerBrand = ci.Beer.Brand,
                BeerImageUrl = ci.Beer.ImageUrl,
                Quantity = ci.Quantity,
                Price = ci.PriceAtAdd,
                Subtotal = ci.Quantity * ci.PriceAtAdd,
                AddedAt = ci.AddedAt
            }).ToList() ?? new List<CartItemDto>();

            return new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = items,
                TotalAmount = items.Sum(i => i.Subtotal),
                TotalItems = items.Sum(i => i.Quantity),
                UpdatedAt = cart.UpdatedAt
            };
        }
    }
}
