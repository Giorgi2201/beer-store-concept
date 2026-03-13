namespace BeerStore.API.Models.DTOs.Auth
{
    public class UpdateAddressDto
    {
        public string? AddressLine { get; set; }
        public string? Phone { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
