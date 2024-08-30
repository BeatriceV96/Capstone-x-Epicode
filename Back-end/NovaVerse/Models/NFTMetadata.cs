using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NovaVerse.Models
{
    public class NFTMetadata
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ArtworkId { get; set; }
        public virtual Artwork Artwork { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string MetadataJson { get; set; }

        [Required]
        [StringLength(50)]
        public string Blockchain { get; set; }

        [Required]
        [StringLength(100)]
        public string TokenId { get; set; }

        [Required]
        [StringLength(42)] // Standard per indirizzi Ethereum
        public string ContractAddress { get; set; }
    }
}
