using BeerStore.API.Models.DTOs;
using BeerStore.API.Models.DTOs.Beer;

namespace BeerStore.API.Services.Interfaces
{
    public interface IBeerService
    {
        Task<PagedResult<BeerDto>> GetBeersAsync(BeerFilterDto filters);
        Task<BeerDto?> GetBeerByIdAsync(int id);
        Task<List<string>> GetAvailableStylesAsync();
        Task<List<string>> GetAvailableBrandsAsync();
        Task<BeerDto> CreateBeerAsync(CreateBeerDto model);
    }
}
