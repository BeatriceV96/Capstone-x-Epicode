using NovaVerse.Dto;
using NovaVerse.Models;

namespace NovaVerse.Interfaces
{
    public interface IArtworkService
    {
        Task<List<Artwork>> GetAllArtworksAsync();
        Task<Artwork> GetArtworkByIdAsync(int id);
        Task<List<Artwork>> GetArtworksByCategoryAsync(int categoryId);
        Task<Artwork> AddArtworkAsync(ArtworkDto artworkDto);
        Task<Artwork> UpdateArtworkAsync(int id, ArtworkDto artworkDto);
        Task<bool> DeleteArtworkAsync(int id);
    }

}
