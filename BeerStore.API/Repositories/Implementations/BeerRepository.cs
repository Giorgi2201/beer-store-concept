using Microsoft.EntityFrameworkCore;
using BeerStore.API.Data;
using BeerStore.API.Models.DTOs.Beer;
using BeerStore.API.Models.Entities;
using BeerStore.API.Repositories.Interfaces;

namespace BeerStore.API.Repositories.Implementations
{
    public class BeerRepository : IBeerRepository
    {
        private readonly BeerStoreDbContext _context;

        public BeerRepository(BeerStoreDbContext context)
        {
            _context = context;
        }

        public async Task<(List<Beer> Beers, int TotalCount)> GetBeersAsync(BeerFilterDto filters)
        {
            var query = _context.Beers
                .Include(b => b.BeerCategories)
                .ThenInclude(bc => bc.Category)
                .AsQueryable();

            // Apply filters
            if (filters.Styles != null && filters.Styles.Any())
            {
                query = query.Where(b => filters.Styles.Contains(b.Style));
            }

            if (filters.Brands != null && filters.Brands.Any())
            {
                query = query.Where(b => filters.Brands.Contains(b.Brand));
            }

            if (filters.MinPrice.HasValue)
            {
                query = query.Where(b => b.Price >= filters.MinPrice.Value);
            }

            if (filters.MaxPrice.HasValue)
            {
                query = query.Where(b => b.Price <= filters.MaxPrice.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.Country))
            {
                query = query.Where(b => b.Country == filters.Country);
            }

            if (filters.IsBestSeller.HasValue)
            {
                query = query.Where(b => b.IsBestSeller == filters.IsBestSeller.Value);
            }

            if (filters.IsLimitedEdition.HasValue)
            {
                query = query.Where(b => b.IsLimitedEdition == filters.IsLimitedEdition.Value);
            }

            if (filters.IsNewArrival.HasValue)
            {
                query = query.Where(b => b.IsNewArrival == filters.IsNewArrival.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.CategoryName))
            {
                var catName = filters.CategoryName;
                query = query.Where(b => b.BeerCategories.Any(bc => bc.Category.Name == catName));
            }

            if (!string.IsNullOrWhiteSpace(filters.SearchTerm))
            {
                var searchTerm = filters.SearchTerm.ToLower();
                query = query.Where(b => 
                    b.Name.ToLower().Contains(searchTerm) ||
                    b.Brand.ToLower().Contains(searchTerm) ||
                    b.Description.ToLower().Contains(searchTerm));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            query = filters.SortBy?.ToLower() switch
            {
                "price-asc" => query.OrderBy(b => b.Price),
                "price-desc" => query.OrderByDescending(b => b.Price),
                "brand" => query.OrderBy(b => b.Brand),
                _ => query.OrderBy(b => b.Name)
            };

            // Apply pagination
            var beers = await query
                .Skip((filters.PageNumber - 1) * filters.PageSize)
                .Take(filters.PageSize)
                .ToListAsync();

            return (beers, totalCount);
        }

        public async Task<Beer?> GetByIdAsync(int id)
        {
            return await _context.Beers
                .Include(b => b.BeerCategories)
                .ThenInclude(bc => bc.Category)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<string>> GetAvailableStylesAsync()
        {
            return await _context.Beers
                .Select(b => b.Style)
                .Distinct()
                .OrderBy(s => s)
                .ToListAsync();
        }

        public async Task<List<string>> GetAvailableBrandsAsync()
        {
            return await _context.Beers
                .Select(b => b.Brand)
                .Distinct()
                .OrderBy(b => b)
                .ToListAsync();
        }

        public async Task<Beer> CreateAsync(Beer beer)
        {
            _context.Beers.Add(beer);
            await _context.SaveChangesAsync();
            return beer;
        }

        public async Task<Beer> UpdateAsync(Beer beer)
        {
            beer.UpdatedAt = DateTime.UtcNow;
            _context.Beers.Update(beer);
            await _context.SaveChangesAsync();
            return beer;
        }

        public async Task DeleteAsync(int id)
        {
            var beer = await _context.Beers.FindAsync(id);
            if (beer != null)
            {
                _context.Beers.Remove(beer);
                await _context.SaveChangesAsync();
            }
        }
    }
}
