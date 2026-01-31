using BeerStore.API.Models.DTOs;
using BeerStore.API.Models.DTOs.Beer;
using BeerStore.API.Models.Entities;
using BeerStore.API.Repositories.Interfaces;
using BeerStore.API.Services.Interfaces;

namespace BeerStore.API.Services.Implementations
{
    public class BeerService : IBeerService
    {
        private readonly IBeerRepository _beerRepository;

        public BeerService(IBeerRepository beerRepository)
        {
            _beerRepository = beerRepository;
        }

        public async Task<PagedResult<BeerDto>> GetBeersAsync(BeerFilterDto filters)
        {
            var (beers, totalCount) = await _beerRepository.GetBeersAsync(filters);

            var beerDtos = beers.Select(MapToBeerDto).ToList();

            return new PagedResult<BeerDto>
            {
                Data = beerDtos,
                TotalCount = totalCount,
                PageNumber = filters.PageNumber,
                PageSize = filters.PageSize
            };
        }

        public async Task<BeerDto?> GetBeerByIdAsync(int id)
        {
            var beer = await _beerRepository.GetByIdAsync(id);
            return beer != null ? MapToBeerDto(beer) : null;
        }

        public async Task<List<string>> GetAvailableStylesAsync()
        {
            return await _beerRepository.GetAvailableStylesAsync();
        }

        public async Task<List<string>> GetAvailableBrandsAsync()
        {
            return await _beerRepository.GetAvailableBrandsAsync();
        }

        public async Task<BeerDto> CreateBeerAsync(CreateBeerDto model)
        {
            var beer = new Beer
            {
                Name = model.Name,
                Brand = model.Brand,
                Style = model.Style,
                Country = model.Country,
                Price = model.Price,
                ImageUrl = model.ImageUrl,
                Description = model.Description,
                AlcoholContent = model.AlcoholContent,
                StockQuantity = model.StockQuantity,
                IsBestSeller = model.IsBestSeller,
                IsLimitedEdition = model.IsLimitedEdition,
                IsNewArrival = model.IsNewArrival,
                CreatedAt = DateTime.UtcNow
            };

            beer = await _beerRepository.CreateAsync(beer);
            return MapToBeerDto(beer);
        }

        private static BeerDto MapToBeerDto(Beer beer)
        {
            return new BeerDto
            {
                Id = beer.Id,
                Name = beer.Name,
                Brand = beer.Brand,
                Style = beer.Style,
                Country = beer.Country,
                Price = beer.Price,
                ImageUrl = beer.ImageUrl,
                Description = beer.Description,
                AlcoholContent = beer.AlcoholContent,
                StockQuantity = beer.StockQuantity,
                IsBestSeller = beer.IsBestSeller,
                IsLimitedEdition = beer.IsLimitedEdition,
                IsNewArrival = beer.IsNewArrival,
                Categories = beer.BeerCategories?.Select(bc => bc.Category.Name).ToList() ?? new List<string>()
            };
        }
    }
}
