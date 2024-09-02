﻿using NovaVerse.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IArtistDashboardService
    {
        Task<List<ArtworkSummaryDto>> GetArtistArtworksAsync(int artistId); // Per ottenere le opere dell'artista con le statistiche
        Task<List<SaleSummaryDto>> GetArtistSalesAsync(int artistId); // Per ottenere le vendite dell'artista con i guadagni
    }
}
