using BeerStore.API.Models.DTOs.Delivery;

namespace BeerStore.API.Services.Interfaces
{
    public interface IDeliveryService
    {
        Task<List<StoreDto>> GetActiveStoresAsync();
        Task<DeliveryQuoteResultDto> GetDeliveryQuoteAsync(double latitude, double longitude);
    }
}
