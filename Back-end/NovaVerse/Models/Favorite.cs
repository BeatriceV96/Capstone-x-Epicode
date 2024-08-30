using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NovaVerse.Models
{
    public class Favorite
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }

        public int? ArtworkId { get; set; }
        public virtual Artwork Artwork { get; set; }

        public int? ArtistId { get; set; }
        public virtual User Artist { get; set; } 

        public DateTime CreateDate { get; set; }
    }
}
