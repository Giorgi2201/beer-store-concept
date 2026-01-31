namespace BeerStore.API.Models.DTOs.Cart
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int BeerId { get; set; }
        public string BeerName { get; set; } = string.Empty;
        public string BeerBrand { get; set; } = string.Empty;
        public string BeerImageUrl { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime AddedAt { get; set; }
    }
}
