namespace NovaVerse.Dto
{
    public class CommentDto
    {
        public int? Id { get; set; } // Questo campo è nullo per le operazioni di creazione
        public int UserId { get; set; } // Id dell'utente che ha fatto il commento
        public int ArtworkId { get; set; } // Id dell'opera d'arte commentata
        public string CommentText { get; set; } // Testo del commento
        public DateTime? CreateDate { get; set; } // Data di creazione, facoltativa
    }
}
