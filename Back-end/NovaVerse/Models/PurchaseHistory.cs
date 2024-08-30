using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NovaVerse.Models
{
    public class PurchaseHistory
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public virtual User User { get; set; }

        [Required]
        public int ArtworkId { get; set; }
        public virtual Artwork Artwork { get; set; }

        [Required]
        public int TransactionId { get; set; }
        public virtual Transaction Transaction { get; set; }
    }
}
