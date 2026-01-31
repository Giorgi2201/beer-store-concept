using System.ComponentModel.DataAnnotations;

namespace BeerStore.API.Models.DTOs.Cart
{
    public class UpdateCartItemDto
    {
        [Required]
        [Range(1, 1000, ErrorMessage = "Quantity must be between 1 and 1000")]
        public int Quantity { get; set; }
    }
}
