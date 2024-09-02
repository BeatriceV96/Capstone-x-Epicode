namespace NovaVerse.Dto
{
    public class PurchaseSummaryDto //Per riassumere gli acquisti effettuati:
    {
        public int ArtworkId { get; set; }
        public string ArtworkTitle { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal PurchasePrice { get; set; }
    }
}
