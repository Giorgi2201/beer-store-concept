namespace BeerStore.API.Models.DTOs.Cart
{
    public class CartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public decimal TotalAmount { get; set; }
        public int TotalItems { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
