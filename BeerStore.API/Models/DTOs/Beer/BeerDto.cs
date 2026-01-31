namespace BeerStore.API.Models.DTOs.Beer
{
    public class BeerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Style { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal AlcoholContent { get; set; }
        public int StockQuantity { get; set; }
        public bool IsBestSeller { get; set; }
        public bool IsLimitedEdition { get; set; }
        public bool IsNewArrival { get; set; }
        public List<string> Categories { get; set; } = new List<string>();
    }
}
