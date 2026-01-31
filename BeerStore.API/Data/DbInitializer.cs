using BeerStore.API.Models.Entities;

namespace BeerStore.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(BeerStoreDbContext context)
        {
            context.Database.EnsureCreated();

            // Check if database has data
            if (context.Beers.Any())
            {
                return; // DB has been seeded
            }

            // Seed Categories
            var categories = new List<Category>
            {
                new Category { Name = "German Beers 🇩🇪", Icon = "🍺", Type = "main" },
                new Category { Name = "Best Sellers", Icon = "🏆", Type = "main" },
                new Category { Name = "Imported Beers", Icon = "🌍", Type = "main" },
                new Category { Name = "Limited Editions", Icon = "⭐", Type = "main" },
                new Category { Name = "New Arrivals", Icon = "🆕", Type = "main" },
                new Category { Name = "Hefeweizen", Icon = "🌾", Type = "style" },
                new Category { Name = "Dark Lager", Icon = "🌑", Type = "style" },
                new Category { Name = "Märzen", Icon = "🍺", Type = "style" },
                new Category { Name = "Helles", Icon = "☀️", Type = "style" },
                new Category { Name = "Pilsner", Icon = "🍻", Type = "style" },
                new Category { Name = "Doppelbock", Icon = "☕", Type = "style" },
                new Category { Name = "Dark Wheat", Icon = "🌾", Type = "style" }
            };

            context.Categories.AddRange(categories);
            context.SaveChanges();

            // Seed Beers
            var beers = new List<Beer>
            {
                new Beer { Name = "Paulaner Hefeweizen", Brand = "Paulaner", Style = "Hefeweizen", Country = "Germany", Price = 4.99m, ImageUrl = "https://via.placeholder.com/200x300?text=Paulaner+Hefeweizen", Description = "Classic Bavarian wheat beer", AlcoholContent = 5.5m, StockQuantity = 100, IsBestSeller = true },
                new Beer { Name = "Paulaner Dunkel", Brand = "Paulaner", Style = "Dark Lager", Country = "Germany", Price = 5.29m, ImageUrl = "https://via.placeholder.com/200x300?text=Paulaner+Dunkel", Description = "Dark Munich lager", AlcoholContent = 4.9m, StockQuantity = 80, IsBestSeller = true },
                new Beer { Name = "Paulaner Oktoberfest", Brand = "Paulaner", Style = "Märzen", Country = "Germany", Price = 5.49m, ImageUrl = "https://via.placeholder.com/200x300?text=Paulaner+Oktoberfest", Description = "Festive Märzen beer", AlcoholContent = 5.8m, StockQuantity = 60, IsBestSeller = false },
                new Beer { Name = "Paulaner Salvator", Brand = "Paulaner", Style = "Doppelbock", Country = "Germany", Price = 5.99m, ImageUrl = "https://via.placeholder.com/200x300?text=Paulaner+Salvator", Description = "Strong doppelbock", AlcoholContent = 7.9m, StockQuantity = 50, IsBestSeller = false },
                new Beer { Name = "Weihenstephaner Hefeweissbier", Brand = "Weihenstephaner", Style = "Hefeweizen", Country = "Germany", Price = 5.49m, ImageUrl = "https://via.placeholder.com/200x300?text=Weihenstephaner+Hefe", Description = "World's oldest brewery wheat beer", AlcoholContent = 5.4m, StockQuantity = 90, IsBestSeller = true },
                new Beer { Name = "Erdinger Weissbier", Brand = "Erdinger", Style = "Hefeweizen", Country = "Germany", Price = 4.79m, ImageUrl = "https://via.placeholder.com/200x300?text=Erdinger", Description = "Popular wheat beer", AlcoholContent = 5.3m, StockQuantity = 120, IsBestSeller = true },
                new Beer { Name = "Hofbräu Original", Brand = "Hofbräu", Style = "Helles", Country = "Germany", Price = 4.99m, ImageUrl = "https://via.placeholder.com/200x300?text=Hofbrau+Original", Description = "Munich helles lager", AlcoholContent = 5.1m, StockQuantity = 100, IsBestSeller = true },
                new Beer { Name = "Franziskaner Hefeweizen", Brand = "Franziskaner", Style = "Hefeweizen", Country = "Germany", Price = 4.89m, ImageUrl = "https://via.placeholder.com/200x300?text=Franziskaner", Description = "Classic Bavarian wheat", AlcoholContent = 5.0m, StockQuantity = 110, IsBestSeller = true },
                new Beer { Name = "Krombacher Pils", Brand = "Krombacher", Style = "Pilsner", Country = "Germany", Price = 4.49m, ImageUrl = "https://via.placeholder.com/200x300?text=Krombacher+Pils", Description = "Premium pilsner", AlcoholContent = 4.8m, StockQuantity = 150, IsBestSeller = true },
                new Beer { Name = "Bitburger Premium Pils", Brand = "Bitburger", Style = "Pilsner", Country = "Germany", Price = 4.59m, ImageUrl = "https://via.placeholder.com/200x300?text=Bitburger", Description = "German pilsner", AlcoholContent = 4.8m, StockQuantity = 140, IsBestSeller = true },
                new Beer { Name = "Spaten Munich Helles", Brand = "Spaten", Style = "Helles", Country = "Germany", Price = 4.69m, ImageUrl = "https://via.placeholder.com/200x300?text=Spaten+Helles", Description = "Traditional Munich beer", AlcoholContent = 5.2m, StockQuantity = 95, IsBestSeller = false },
                new Beer { Name = "Löwenbräu Original", Brand = "Löwenbräu", Style = "Helles", Country = "Germany", Price = 4.79m, ImageUrl = "https://via.placeholder.com/200x300?text=Lowenbrau", Description = "Munich brewery classic", AlcoholContent = 5.2m, StockQuantity = 85, IsBestSeller = false },
                new Beer { Name = "Warsteiner Premium Verum", Brand = "Warsteiner", Style = "Pilsner", Country = "Germany", Price = 4.39m, ImageUrl = "https://via.placeholder.com/200x300?text=Warsteiner", Description = "Premium pilsner", AlcoholContent = 4.8m, StockQuantity = 130, IsBestSeller = true },
                new Beer { Name = "Beck's Pilsner", Brand = "Beck's", Style = "Pilsner", Country = "Germany", Price = 3.99m, ImageUrl = "https://via.placeholder.com/200x300?text=Becks", Description = "International pilsner", AlcoholContent = 5.0m, StockQuantity = 200, IsBestSeller = true },
                new Beer { Name = "Radeberger Pilsner", Brand = "Radeberger", Style = "Pilsner", Country = "Germany", Price = 4.69m, ImageUrl = "https://via.placeholder.com/200x300?text=Radeberger", Description = "Saxon pilsner", AlcoholContent = 4.8m, StockQuantity = 90, IsBestSeller = false },
                new Beer { Name = "Benediktiner Weissbier", Brand = "Benediktiner", Style = "Hefeweizen", Country = "Germany", Price = 4.99m, ImageUrl = "https://via.placeholder.com/200x300?text=Benediktiner", Description = "Traditional wheat beer", AlcoholContent = 5.4m, StockQuantity = 75, IsBestSeller = false }
            };

            context.Beers.AddRange(beers);
            context.SaveChanges();

            // Create beer-category relationships
            // Note: In a real scenario, you'd link beers to appropriate categories
            var germanBeersCategory = categories.First(c => c.Name == "German Beers 🇩🇪");
            var bestSellersCategory = categories.First(c => c.Name == "Best Sellers");

            foreach (var beer in beers)
            {
                // All beers are German
                context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = germanBeersCategory.Id });
                
                // Best sellers
                if (beer.IsBestSeller)
                {
                    context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = bestSellersCategory.Id });
                }
            }

            context.SaveChanges();
        }
    }
}
