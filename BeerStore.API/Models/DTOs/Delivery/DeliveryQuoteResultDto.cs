namespace BeerStore.API.Models.DTOs.Delivery
{
    public class DeliveryQuoteResultDto
    {
        public double Cost { get; set; }
        public double DistanceKm { get; set; }
        public bool InZone { get; set; }
        public string NearestStoreName { get; set; } = string.Empty;
        public int NearestStoreId { get; set; }
    }
}
