using System.ComponentModel.DataAnnotations;

namespace BeerStore.API.Models.DTOs.Cart
{
    public class AddToCartDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid beer ID")]
        public int BeerId { get; set; }

        [Required]
        [Range(1, 1000, ErrorMessage = "Quantity must be between 1 and 1000")]
        public int Quantity { get; set; } = 1;
    }
}
