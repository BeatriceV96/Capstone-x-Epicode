namespace NovaVerse.Dto
{
    public class ArtistSearchDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Bio { get; set; }
        public string ProfilePicture { get; set; }
        public List<ArtworkDto> Artworks { get; set; }
    }
}
