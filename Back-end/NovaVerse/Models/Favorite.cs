using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NovaVerse.Models
{
    public class Favorite
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // Collegamento all'utente che ha favorito l'opera
        public User User { get; set; }

        [Required]
        public int ArtworkId { get; set; } // Collegamento all'opera d'arte favorita
        public Artwork Artwork { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
