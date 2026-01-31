using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeerStore.API.Models.Entities
{
    public class BeerCategory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BeerId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        // Navigation properties
        [ForeignKey("BeerId")]
        public virtual Beer Beer { get; set; } = null!;

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;
    }
}
