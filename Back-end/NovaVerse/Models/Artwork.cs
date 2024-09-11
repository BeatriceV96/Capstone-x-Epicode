using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NovaVerse.Models
{
    public class Artwork
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string Description { get; set; }

        
        public byte[] Photo { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        [Required]
        public ArtworkType Type { get; set; } // Macro-categoria dell'opera: OPERE o NFT

        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public int ArtistId { get; set; } // Collegamento all'artista che ha creato l'opera
        public virtual User Artist { get; set; }

        public int? BuyerId { get; set; } // Collegamento opzionale all'acquirente dell'opera (solo per OPERE)
        public virtual User Buyer { get; set; }

        public DateTime CreateDate { get; set; }

        public int ViewCount { get; set; } = 0;

        // Proprietà di navigazione per NFTMetadata
        public virtual NFTMetadata NFTMetadata { get; set; }

        public int? TransactionId { get; set; }
        public virtual Transaction Transaction { get; set; }

        public virtual ICollection<ShoppingCartItem> ShoppingCartItems { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Favorite> Favorites { get; set; }
        public virtual ICollection<TransactionArtworks> TransactionArtworks { get; set; }
    }
}
