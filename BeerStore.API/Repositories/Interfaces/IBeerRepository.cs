using BeerStore.API.Models.DTOs.Beer;
using BeerStore.API.Models.Entities;

namespace BeerStore.API.Repositories.Interfaces
{
    public interface IBeerRepository
    {
        Task<(List<Beer> Beers, int TotalCount)> GetBeersAsync(BeerFilterDto filters);
        Task<Beer?> GetByIdAsync(int id);
        Task<List<string>> GetAvailableStylesAsync();
        Task<List<string>> GetAvailableBrandsAsync();
        Task<Beer> CreateAsync(Beer beer);
        Task<Beer> UpdateAsync(Beer beer);
        Task DeleteAsync(int id);
    }
}
