using Microsoft.AspNetCore.Mvc;
using BeerStore.API.Models.DTOs.Delivery;
using BeerStore.API.Services.Interfaces;

namespace BeerStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;

        public DeliveryController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        /// <summary>Returns all active store locations.</summary>
        [HttpGet("stores")]
        public async Task<ActionResult<List<StoreDto>>> GetStores()
        {
            var stores = await _deliveryService.GetActiveStoresAsync();
            return Ok(stores);
        }

        /// <summary>
        /// Calculates delivery cost for the given coordinates.
        /// Returns cost, distance from nearest store, zone membership, and store name.
        /// </summary>
        [HttpPost("quote")]
        public async Task<ActionResult<DeliveryQuoteResultDto>> GetQuote([FromBody] DeliveryQuoteRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _deliveryService.GetDeliveryQuoteAsync(request.Latitude, request.Longitude);
            return Ok(result);
        }
    }
}
