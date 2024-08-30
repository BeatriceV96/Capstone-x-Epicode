using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NovaVerse.Models
{
    public class Transaction
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ArtworkId { get; set; }

        public virtual Artwork Artwork { get; set; }

        [Required]
        public int BuyerId { get; set; } // Collegamento all'acquirente
        public User Buyer { get; set; }

        [Required]
        public int SellerId { get; set; } // Collegamento al venditore (artista)
        public User Seller { get; set; }

        public DateTime TransactionDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; }

        [Required]
        [StringLength(20)]
        public string TransactionStatus { get; set; }
    }
}
