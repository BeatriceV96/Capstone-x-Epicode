using System;
using System.ComponentModel.DataAnnotations;

namespace NovaVerse.Dto
{
    public class NotificationDto
    {
        public int Id { get; set; } // Opzionale, utilizzato solo per update o lettura

        [Required]
        public int SenderId { get; set; } // ID dell'utente mittente

        [Required]
        public int ReceiverId { get; set; } // ID dell'utente destinatario

        [Required]
        [StringLength(255)]
        public string Message { get; set; } // Messaggio della notifica

        public string Link { get; set; } // Link associato alla notifica

        public DateTime Date { get; set; } = DateTime.UtcNow; // Data e ora della creazione

        public bool IsRead { get; set; } = false; // Stato di lettura della notifica
    }
}
