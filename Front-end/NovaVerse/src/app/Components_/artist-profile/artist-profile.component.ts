import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { iUser } from '../../Models/i-user';
import { Artwork } from '../../Models/artwork';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ArtworkService } from '../../services/artwork.service';

@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit {
  artist: iUser | null = null;  // Dati dell'artista
  artworks: Artwork[] = [];     // Lista delle opere
  loadingArtworks: boolean = true;
  noArtworks = false;
  artistId: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private artworkService: ArtworkService,
    private router: Router
  ) {
    console.log('ArtistProfileComponent caricato'); // Verifica se il componente si carica
  }


  ngOnInit(): void {
    // Recupera l'ID dell'artista dalla URL
    this.route.paramMap.pipe(
      switchMap(params => {
        const artistId = Number(params.get('id'));
        console.log('Artist ID recuperato dalla URL:', artistId);  // Log dell'ID dell'artista
        if (isNaN(artistId) || artistId <= 0) {
          console.error('ID artista non valido:', artistId);
          return of(null);  // Ritorna un observable vuoto in caso di ID non valido
        }
        return this.artistService.getArtistById(artistId);
      }),
      tap(artist => {
        if (artist) {
          this.artist = artist;
          console.log('Artista ricevuto:', artist);

          // Carica le opere dell'artista
          this.loadArtworks(artist.id);
        } else {
          console.error('Nessun artista trovato.');
        }
      }),
      catchError(error => {
        console.error('Errore durante il caricamento dell\'artista:', error);
        return of(null);  // Ritorna un observable vuoto in caso di errore
      })
    ).subscribe();
  }

  loadArtworks(artistId: number): void {
    this.loadingArtworks = true; // Mostra loading
    this.artistService.getArtworksByUserId(artistId).subscribe(
      artworks => {
        this.artworks = artworks;
        this.loadingArtworks = false; // Nascondi loading
        this.noArtworks = artworks.length === 0; // Controlla se non ci sono opere
      },
      error => {
        console.error('Errore nel caricamento delle opere:', error);
        this.loadingArtworks = false; // Nascondi loading anche in caso di errore
        this.noArtworks = true;
      }
    );
  }

  loadArtistProfile(artistId: number): void {
    this.artistService.getArtistById(artistId).subscribe(
      artist => {
        this.artist = artist;
        if (artist && artist.id > 0) {
          this.loadArtworks(artist.id);
        }
      },
      error => {
        console.error('Errore nel caricamento del profilo artista:', error);
      }
    );
  }

  getProfilePictureUrl(profilePicturePath: string | null): string {
    if (!profilePicturePath) {
      return 'http://localhost:5034/uploads/default-profile.png';  // Immagine di default
    }

    if (profilePicturePath.startsWith('/uploads')) {
      return 'http://localhost:5034' + profilePicturePath;
    }

    return 'http://localhost:5034/uploads/' + profilePicturePath;
  }


  getArtworkImageUrl(artwork: Artwork): string {
    return artwork.photo || 'assets/images/default-artwork.jpg';  // Immagine di default per le opere
  }



  // Metodo per navigare alla home
  goBack(): void {
    this.router.navigate(['/']);
  }
}
