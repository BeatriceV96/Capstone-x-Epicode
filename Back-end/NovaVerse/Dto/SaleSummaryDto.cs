namespace NovaVerse.Dto
{
    public class SaleSummaryDto  //Per riassumere le vendite effettuate:
    {
        public int ArtworkId { get; set; }
        public string ArtworkTitle { get; set; }
        public DateTime SaleDate { get; set; }
        public decimal SalePrice { get; set; }
        public decimal TotalSales { get; set; }

    }
}
