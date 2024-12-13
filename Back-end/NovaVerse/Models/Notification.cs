using System;
using System.ComponentModel.DataAnnotations;

namespace NovaVerse.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SenderId { get; set; }
        public virtual User Sender { get; set; } // Relazione con User

        [Required]
        public int ReceiverId { get; set; }
        public virtual User Receiver { get; set; } // Relazione con User

        [Required]
        [StringLength(255)]
        public string Message { get; set; }

        public string Link { get; set; }

        // Aggiungi questa proprietà
        [Required]
        public DateTime Date { get; set; }

        public bool IsRead { get; set; }
    }
}
