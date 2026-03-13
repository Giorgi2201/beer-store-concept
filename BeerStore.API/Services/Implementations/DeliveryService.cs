using Microsoft.EntityFrameworkCore;
using BeerStore.API.Data;
using BeerStore.API.Models.DTOs.Delivery;
using BeerStore.API.Services.Interfaces;

namespace BeerStore.API.Services.Implementations
{
    public class DeliveryService : IDeliveryService
    {
        // Delivery zone: single circle centred on Tbilisi (fits village Koda at ~13.1 km)
        private const double TbilisiCenterLat = 41.6938;
        private const double TbilisiCenterLng = 44.8015;
        private const double DeliveryZoneKm   = 13.5;
        private const double MinDeliveryCost  = 1.0;
        private const double MaxDeliveryCost  = 4.0;

        private readonly BeerStoreDbContext _context;

        public DeliveryService(BeerStoreDbContext context)
        {
            _context = context;
        }

        public async Task<List<StoreDto>> GetActiveStoresAsync()
        {
            return await _context.Stores
                .Where(s => s.IsActive)
                .Select(s => new StoreDto
                {
                    Id       = s.Id,
                    Name     = s.Name,
                    Latitude = s.Latitude,
                    Longitude = s.Longitude
                })
                .ToListAsync();
        }

        public async Task<DeliveryQuoteResultDto> GetDeliveryQuoteAsync(double latitude, double longitude)
        {
            var stores = await GetActiveStoresAsync();
            if (!stores.Any())
            {
                return new DeliveryQuoteResultDto { InZone = false };
            }

            // 1. Check delivery zone (distance from Tbilisi city centre)
            var distFromCenter = CalculateDistanceKm(latitude, longitude, TbilisiCenterLat, TbilisiCenterLng);

            // 2. Find nearest store
            var nearest    = stores[0];
            var nearestDist = CalculateDistanceKm(latitude, longitude, nearest.Latitude, nearest.Longitude);

            foreach (var store in stores.Skip(1))
            {
                var d = CalculateDistanceKm(latitude, longitude, store.Latitude, store.Longitude);
                if (d < nearestDist)
                {
                    nearestDist = d;
                    nearest     = store;
                }
            }

            nearestDist = Math.Round(nearestDist * 10) / 10;

            if (distFromCenter > DeliveryZoneKm)
            {
                return new DeliveryQuoteResultDto
                {
                    Cost            = 0,
                    DistanceKm      = nearestDist,
                    InZone          = false,
                    NearestStoreName = nearest.Name,
                    NearestStoreId  = nearest.Id
                };
            }

            // 3. Price: linear scale from MinDeliveryCost (≤1 km) to MaxDeliveryCost (at zone edge)
            double cost = nearestDist <= 1
                ? MinDeliveryCost
                : Math.Min(
                    MaxDeliveryCost,
                    MinDeliveryCost + ((nearestDist - 1) / (DeliveryZoneKm - 1)) * (MaxDeliveryCost - MinDeliveryCost)
                  );

            return new DeliveryQuoteResultDto
            {
                Cost             = Math.Round(cost * 100) / 100,
                DistanceKm       = nearestDist,
                InZone           = true,
                NearestStoreName = nearest.Name,
                NearestStoreId   = nearest.Id
            };
        }

        // Haversine formula — great-circle distance in km
        private static double CalculateDistanceKm(double lat1, double lng1, double lat2, double lng2)
        {
            const double R = 6371;
            var dLat = ToRad(lat2 - lat1);
            var dLng = ToRad(lng2 - lng1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
                  + Math.Cos(ToRad(lat1)) * Math.Cos(ToRad(lat2))
                  * Math.Sin(dLng / 2) * Math.Sin(dLng / 2);
            return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        }

        private static double ToRad(double deg) => deg * Math.PI / 180;
    }
}
