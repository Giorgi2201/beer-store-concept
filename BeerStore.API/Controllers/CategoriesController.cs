using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeerStore.API.Data;
using BeerStore.API.Models.Entities;

namespace BeerStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly BeerStoreDbContext _context;

        public CategoriesController(BeerStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetCategories()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Type)
                .ThenBy(c => c.Name)
                .ToListAsync();
            
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }
    }
}
