using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NovaVerse.Models
{
    public class User
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [StringLength(50)]
        public string Password { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public byte[] ProfilePicture { get; set; } // Modificato da string a byte[]

        [Required]
        public string Bio { get; set; }

        [Required]
        [EnumDataType(typeof(UserRole))]
        public UserRole Role { get; set; }

        public DateTime CreateDate { get; set; }

        public enum UserRole
        {
            Artist,
            Buyer,
            //Admin??
        }

        public virtual ICollection<Artwork> Artworks { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ShoppingCart ShoppingCart { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Favorite> Favorites { get; set; }
        public virtual ICollection<PurchaseHistory> PurchaseHistories { get; set; }
    }
}
