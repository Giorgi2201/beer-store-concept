namespace BeerStore.API.Models.DTOs.Beer
{
    public class BeerFilterDto
    {
        public List<string>? Styles { get; set; }
        public List<string>? Brands { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Country { get; set; }
        public bool? IsBestSeller { get; set; }
        public bool? IsLimitedEdition { get; set; }
        public bool? IsNewArrival { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; } = "name"; // name, price-asc, price-desc, brand
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
