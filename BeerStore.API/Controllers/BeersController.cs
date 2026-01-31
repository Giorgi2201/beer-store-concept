using Microsoft.AspNetCore.Mvc;
using BeerStore.API.Models.DTOs;
using BeerStore.API.Models.DTOs.Beer;
using BeerStore.API.Services.Interfaces;

namespace BeerStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeersController : ControllerBase
    {
        private readonly IBeerService _beerService;

        public BeersController(IBeerService beerService)
        {
            _beerService = beerService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<BeerDto>>> GetBeers([FromQuery] BeerFilterDto filters)
        {
            var result = await _beerService.GetBeersAsync(filters);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BeerDto>> GetBeer(int id)
        {
            var beer = await _beerService.GetBeerByIdAsync(id);
            if (beer == null)
            {
                return NotFound();
            }
            return Ok(beer);
        }

        [HttpGet("styles")]
        public async Task<ActionResult<List<string>>> GetAvailableStyles()
        {
            var styles = await _beerService.GetAvailableStylesAsync();
            return Ok(styles);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<List<string>>> GetAvailableBrands()
        {
            var brands = await _beerService.GetAvailableBrandsAsync();
            return Ok(brands);
        }

        [HttpGet("best-sellers")]
        public async Task<ActionResult<List<BeerDto>>> GetBestSellers()
        {
            var filters = new BeerFilterDto
            {
                IsBestSeller = true,
                PageSize = 50
            };
            var result = await _beerService.GetBeersAsync(filters);
            return Ok(result.Data);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<BeerDto>>> Search([FromQuery] string q)
        {
            var filters = new BeerFilterDto
            {
                SearchTerm = q,
                PageSize = 50
            };
            var result = await _beerService.GetBeersAsync(filters);
            return Ok(result.Data);
        }
    }
}
