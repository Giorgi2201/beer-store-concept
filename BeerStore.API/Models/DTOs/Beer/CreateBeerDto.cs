using System.ComponentModel.DataAnnotations;

namespace BeerStore.API.Models.DTOs.Beer
{
    public class CreateBeerDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Style { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 10000)]
        public decimal Price { get; set; }

        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Range(0, 100)]
        public decimal AlcoholContent { get; set; }

        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }

        public bool IsBestSeller { get; set; }
        public bool IsLimitedEdition { get; set; }
        public bool IsNewArrival { get; set; }

        public List<int> CategoryIds { get; set; } = new List<int>();
    }
}
