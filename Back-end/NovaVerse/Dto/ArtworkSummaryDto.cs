namespace NovaVerse.Dto
{
    public class ArtworkSummaryDto  //Per riassumere le opere d'arte con statistiche:
    {
        public int ArtworkId { get; set; }
        public string Title { get; set; }
        public int ViewCount { get; set; } // Statistiche di visualizzazione
        public int SalesCount { get; set; } // Numero di vendite
        public decimal TotalEarnings { get; set; } // Guadagni totali
    }
}
