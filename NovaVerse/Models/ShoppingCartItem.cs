using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NovaVerse.Models
{
    public class ShoppingCartItem
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ShoppingCartId { get; set; }
        public virtual ShoppingCart ShoppingCart { get; set; }

        [Required]
        public int ArtworkId { get; set; }
        public virtual Artwork Artwork { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal PriceAtAddTime { get; set; }

        public int? TransactionId { get; set; }
        public virtual Transaction Transaction { get; set; }
    }
}
