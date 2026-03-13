using Microsoft.EntityFrameworkCore;
using BeerStore.API.Models.Entities;

namespace BeerStore.API.Data
{
    public class BeerStoreDbContext : DbContext
    {
        public BeerStoreDbContext(DbContextOptions<BeerStoreDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Beer> Beers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BeerCategory> BeerCategories { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasOne(u => u.Cart)
                      .WithOne(c => c.User)
                      .HasForeignKey<Cart>(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Beer configuration
            modelBuilder.Entity<Beer>(entity =>
            {
                entity.HasIndex(e => e.Brand);
                entity.HasIndex(e => e.Style);
                entity.HasIndex(e => e.IsBestSeller);
            });

            // BeerCategory configuration (Many-to-Many)
            modelBuilder.Entity<BeerCategory>(entity =>
            {
                entity.HasKey(bc => new { bc.BeerId, bc.CategoryId });
                
                entity.HasOne(bc => bc.Beer)
                      .WithMany(b => b.BeerCategories)
                      .HasForeignKey(bc => bc.BeerId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(bc => bc.Category)
                      .WithMany(c => c.BeerCategories)
                      .HasForeignKey(bc => bc.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Cart configuration
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasMany(c => c.CartItems)
                      .WithOne(ci => ci.Cart)
                      .HasForeignKey(ci => ci.CartId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // CartItem configuration
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasOne(ci => ci.Beer)
                      .WithMany(b => b.CartItems)
                      .HasForeignKey(ci => ci.BeerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasIndex(e => e.OrderNumber).IsUnique();
                
                entity.HasMany(o => o.OrderItems)
                      .WithOne(oi => oi.Order)
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // OrderItem configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasOne(oi => oi.Beer)
                      .WithMany(b => b.OrderItems)
                      .HasForeignKey(oi => oi.BeerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
