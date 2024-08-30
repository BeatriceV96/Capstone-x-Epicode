using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NovaVerse.Models
{
    public class Comment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // Collegamento all'utente che ha fatto il commento
        public User User { get; set; }

        [Required]
        public int ArtworkId { get; set; } // Collegamento all'opera d'arte commentata
        public Artwork Artwork { get; set; }

        public DateTime CreateDate { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string CommentText { get; set; }
    }
}
