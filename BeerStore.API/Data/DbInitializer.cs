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
                // Still seed stores if missing (added after initial DB creation)
                if (!context.Stores.Any())
                {
                    SeedStores(context);
                }
                return;
            }

            SeedStores(context);

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
                new Category { Name = "Dark Wheat", Icon = "🌾", Type = "style" },
                new Category { Name = "Georgian Beers", Icon = "🇬🇪", Type = "main" },
                new Category { Name = "Lager", Icon = "🍺", Type = "style" }
            };

            context.Categories.AddRange(categories);
            context.SaveChanges();

            // Seed Beers
            var beers = new List<Beer>
            {
                new Beer { Name = "Paulaner Hefeweizen", Brand = "Paulaner", Style = "Hefeweizen", Country = "Germany", Price = 4.99m, ImageUrl = "https://placehold.co/200x300/d4a574/2c1810?text=Paulaner+Hefeweizen", Description = "Classic Bavarian wheat beer", AlcoholContent = 5.5m, StockQuantity = 100, IsBestSeller = true },
                new Beer { Name = "Paulaner Dunkel", Brand = "Paulaner", Style = "Dark Lager", Country = "Germany", Price = 5.29m, ImageUrl = "https://placehold.co/200x300/5c4033/d4a574?text=Paulaner+Dunkel", Description = "Dark Munich lager", AlcoholContent = 4.9m, StockQuantity = 80, IsBestSeller = true },
                new Beer { Name = "Paulaner Oktoberfest", Brand = "Paulaner", Style = "Märzen", Country = "Germany", Price = 5.49m, ImageUrl = "https://placehold.co/200x300/c9933e/2c1810?text=Paulaner+Oktoberfest", Description = "Festive Märzen beer", AlcoholContent = 5.8m, StockQuantity = 60, IsBestSeller = false },
                new Beer { Name = "Paulaner Salvator", Brand = "Paulaner", Style = "Doppelbock", Country = "Germany", Price = 5.99m, ImageUrl = "https://placehold.co/200x300/3d2817/d4a574?text=Paulaner+Salvator", Description = "Strong doppelbock", AlcoholContent = 7.9m, StockQuantity = 50, IsBestSeller = false },
                new Beer { Name = "Weihenstephaner Hefeweissbier", Brand = "Weihenstephaner", Style = "Hefeweizen", Country = "Germany", Price = 5.49m, ImageUrl = "https://placehold.co/200x300/e8d5a8/2c1810?text=Weihenstephaner", Description = "World's oldest brewery wheat beer", AlcoholContent = 5.4m, StockQuantity = 90, IsBestSeller = true },
                new Beer { Name = "Erdinger Weissbier", Brand = "Erdinger", Style = "Hefeweizen", Country = "Germany", Price = 4.79m, ImageUrl = "https://placehold.co/200x300/f4e4c1/2c1810?text=Erdinger", Description = "Popular wheat beer", AlcoholContent = 5.3m, StockQuantity = 120, IsBestSeller = true },
                new Beer { Name = "Hofbräu Original", Brand = "Hofbräu", Style = "Helles", Country = "Germany", Price = 4.99m, ImageUrl = "https://placehold.co/200x300/f5d76e/2c1810?text=Hofbrau", Description = "Munich helles lager", AlcoholContent = 5.1m, StockQuantity = 100, IsBestSeller = true },
                new Beer { Name = "Franziskaner Hefeweizen", Brand = "Franziskaner", Style = "Hefeweizen", Country = "Germany", Price = 4.89m, ImageUrl = "https://placehold.co/200x300/ddb96d/2c1810?text=Franziskaner", Description = "Classic Bavarian wheat", AlcoholContent = 5.0m, StockQuantity = 110, IsBestSeller = true },
                new Beer { Name = "Krombacher Pils", Brand = "Krombacher", Style = "Pilsner", Country = "Germany", Price = 4.49m, ImageUrl = "https://placehold.co/200x300/f5e5a0/2c1810?text=Krombacher", Description = "Premium pilsner", AlcoholContent = 4.8m, StockQuantity = 150, IsBestSeller = true },
                new Beer { Name = "Bitburger Premium Pils", Brand = "Bitburger", Style = "Pilsner", Country = "Germany", Price = 4.59m, ImageUrl = "https://placehold.co/200x300/f7e7b4/2c1810?text=Bitburger", Description = "German pilsner", AlcoholContent = 4.8m, StockQuantity = 140, IsBestSeller = true },
                new Beer { Name = "Spaten Munich Helles", Brand = "Spaten", Style = "Helles", Country = "Germany", Price = 4.69m, ImageUrl = "https://placehold.co/200x300/ead57e/2c1810?text=Spaten", Description = "Traditional Munich beer", AlcoholContent = 5.2m, StockQuantity = 95, IsBestSeller = false },
                new Beer { Name = "Löwenbräu Original", Brand = "Löwenbräu", Style = "Helles", Country = "Germany", Price = 4.79m, ImageUrl = "https://placehold.co/200x300/f0d98d/2c1810?text=Lowenbrau", Description = "Munich brewery classic", AlcoholContent = 5.2m, StockQuantity = 85, IsBestSeller = false },
                new Beer { Name = "Warsteiner Premium Verum", Brand = "Warsteiner", Style = "Pilsner", Country = "Germany", Price = 4.39m, ImageUrl = "https://placehold.co/200x300/f8e9bb/2c1810?text=Warsteiner", Description = "Premium pilsner", AlcoholContent = 4.8m, StockQuantity = 130, IsBestSeller = true },
                new Beer { Name = "Beck's Pilsner", Brand = "Beck's", Style = "Pilsner", Country = "Germany", Price = 3.99m, ImageUrl = "https://placehold.co/200x300/fdf0c7/2c1810?text=Becks", Description = "International pilsner", AlcoholContent = 5.0m, StockQuantity = 200, IsBestSeller = true },
                new Beer { Name = "Radeberger Pilsner", Brand = "Radeberger", Style = "Pilsner", Country = "Germany", Price = 4.69m, ImageUrl = "https://placehold.co/200x300/e5c77a/2c1810?text=Radeberger", Description = "Saxon pilsner", AlcoholContent = 4.8m, StockQuantity = 90, IsBestSeller = false },
                new Beer { Name = "Benediktiner Weissbier", Brand = "Benediktiner", Style = "Hefeweizen", Country = "Germany", Price = 4.99m, ImageUrl = "https://placehold.co/200x300/d9b76a/2c1810?text=Benediktiner", Description = "Traditional wheat beer", AlcoholContent = 5.4m, StockQuantity = 75, IsBestSeller = false },

                // Georgian Beers
                new Beer { Name = "Natakhtari Light", Brand = "Natakhtari", Style = "Lager", Country = "Georgia", Price = 2.99m, ImageUrl = "https://placehold.co/200x300/d4e8a8/2c3810?text=Natakhtari+Light", Description = "The most popular Georgian lager, crisp and refreshing with a clean finish.", AlcoholContent = 4.5m, StockQuantity = 120, IsBestSeller = false },
                new Beer { Name = "Natakhtari Dark", Brand = "Natakhtari", Style = "Dark Lager", Country = "Georgia", Price = 3.19m, ImageUrl = "https://placehold.co/200x300/3d2817/d4a574?text=Natakhtari+Dark", Description = "Dark Georgian lager with a smooth roasted malt character and mild sweetness.", AlcoholContent = 4.5m, StockQuantity = 90, IsBestSeller = false },
                new Beer { Name = "Kazbegi Lager", Brand = "Kazbegi", Style = "Lager", Country = "Georgia", Price = 2.79m, ImageUrl = "https://placehold.co/200x300/c8e09a/2c3810?text=Kazbegi", Description = "Named after the majestic Mount Kazbegi, this golden lager is Georgia's proudest export.", AlcoholContent = 4.7m, StockQuantity = 150, IsBestSeller = false },
                new Beer { Name = "Argo Lager", Brand = "Argo", Style = "Lager", Country = "Georgia", Price = 2.49m, ImageUrl = "https://placehold.co/200x300/e8d878/2c3810?text=Argo", Description = "A light, easy-drinking Georgian lager beloved for its balance and affordability.", AlcoholContent = 4.5m, StockQuantity = 130, IsBestSeller = false },
                new Beer { Name = "Zedazeni Classic", Brand = "Zedazeni", Style = "Lager", Country = "Georgia", Price = 2.29m, ImageUrl = "https://placehold.co/200x300/f0e090/2c3810?text=Zedazeni", Description = "One of Georgia's oldest beer brands, brewed since the Soviet era with a timeless recipe.", AlcoholContent = 4.4m, StockQuantity = 100, IsBestSeller = false },
                new Beer { Name = "Mtiebi Dark", Brand = "Mtiebi", Style = "Dark Lager", Country = "Georgia", Price = 2.49m, ImageUrl = "https://placehold.co/200x300/2c1810/d4a574?text=Mtiebi+Dark", Description = "Rich dark Georgian lager with notes of caramel and toasted grain.", AlcoholContent = 4.6m, StockQuantity = 80, IsBestSeller = false },
                new Beer { Name = "Tsela Lager", Brand = "Tsela", Style = "Lager", Country = "Georgia", Price = 2.59m, ImageUrl = "https://placehold.co/200x300/d8f0a0/2c3810?text=Tsela", Description = "A modern Georgian lager with a fresh hop character and clean bitterness.", AlcoholContent = 4.5m, StockQuantity = 110, IsBestSeller = false },
                new Beer { Name = "Aleksandreuli Pilsner", Brand = "Aleksandreuli", Style = "Pilsner", Country = "Georgia", Price = 2.39m, ImageUrl = "https://placehold.co/200x300/f5e5a0/2c3810?text=Aleksandreuli", Description = "A Georgian pilsner with a fine hop aroma and a crisp, dry finish.", AlcoholContent = 5.0m, StockQuantity = 95, IsBestSeller = false },
                new Beer { Name = "Dueti Lager", Brand = "Dueti", Style = "Lager", Country = "Georgia", Price = 2.19m, ImageUrl = "https://placehold.co/200x300/e0f0c0/2c3810?text=Dueti", Description = "Light and unpretentious, Dueti is a staple everyday Georgian lager.", AlcoholContent = 4.3m, StockQuantity = 140, IsBestSeller = false },
                new Beer { Name = "Old Tbilisi", Brand = "Old Tbilisi", Style = "Lager", Country = "Georgia", Price = 2.89m, ImageUrl = "https://placehold.co/200x300/c8b870/2c3810?text=Old+Tbilisi", Description = "Brewed in the heart of the capital, this amber lager captures the spirit of old-town Tbilisi.", AlcoholContent = 5.2m, StockQuantity = 85, IsBestSeller = false }
            };

            context.Beers.AddRange(beers);
            context.SaveChanges();

            // Create beer-category relationships
            var germanBeersCategory = categories.First(c => c.Name == "German Beers 🇩🇪");
            var bestSellersCategory = categories.First(c => c.Name == "Best Sellers");
            var importedBeersCategory = categories.First(c => c.Name == "Imported Beers");
            var georgianBeersCategory = categories.First(c => c.Name == "Georgian Beers");
            var lagerCategory = categories.First(c => c.Name == "Lager");
            var darkLagerCategory = categories.First(c => c.Name == "Dark Lager");
            var pilsnerCategory = categories.First(c => c.Name == "Pilsner");

            foreach (var beer in beers)
            {
                if (beer.Country == "Germany")
                {
                    context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = germanBeersCategory.Id });
                    context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = importedBeersCategory.Id });
                }

                if (beer.Country == "Georgia")
                {
                    context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = georgianBeersCategory.Id });
                    context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = importedBeersCategory.Id });

                    if (beer.Style == "Lager")
                        context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = lagerCategory.Id });
                    else if (beer.Style == "Dark Lager")
                        context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = darkLagerCategory.Id });
                    else if (beer.Style == "Pilsner")
                        context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = pilsnerCategory.Id });
                }

                if (beer.IsBestSeller)
                    context.BeerCategories.Add(new BeerCategory { BeerId = beer.Id, CategoryId = bestSellersCategory.Id });
            }

            context.SaveChanges();
        }

        private static void SeedStores(BeerStoreDbContext context)
        {
            var stores = new List<Store>
            {
                new Store { Name = "Beer Store - South", Latitude = 41.674684, Longitude = 44.829845, IsActive = true },
                new Store { Name = "Beer Store - East",  Latitude = 41.691878, Longitude = 44.848633, IsActive = true },
                new Store { Name = "Beer Store - West",  Latitude = 41.722852, Longitude = 44.750791, IsActive = true },
                new Store { Name = "Beer Store - North", Latitude = 41.771832, Longitude = 44.771753, IsActive = true }
            };
            context.Stores.AddRange(stores);
            context.SaveChanges();
        }
    }
}
