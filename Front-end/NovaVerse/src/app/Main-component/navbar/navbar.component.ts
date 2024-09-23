import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { iUser } from '../../Models/i-user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchQuery = new BehaviorSubject<string>('');  // Variabile per tracciare la ricerca
  suggestedArtists$: Observable<iUser[]>;         // Osservabile per i suggerimenti degli artisti
  artist: iUser | null = null;                    // Variabile per gestire il profilo dell'artista
  loading = false;                                // Variabile per gestire lo stato di caricamento

  constructor(
    private authService: AuthService,
    private router: Router,
    private artistService: ArtistService
  ) {
    // Collegamento della query di ricerca con il servizio di ricerca degli artisti
    this.suggestedArtists$ = this.searchQuery.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        console.log('Searching for:', query);  // Log della query
        return query.trim() !== '' ? this.artistService.searchArtists(query).pipe(
          tap(artists => console.log('Artists found:', artists)),  // Log per vedere i risultati
          catchError(error => {
            console.error('Errore nella ricerca degli artisti:', error);
            return of([]);
          })
        ) : of([]);
      })
    );
  }

  // Metodo per controllare se l'utente è loggato
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  // Metodo per eseguire il logout
  onLogout(): void {
    this.authService.logout();
  }

  // Metodo per aggiornare la query di ricerca
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.next(inputElement.value);  // Aggiorna la ricerca
  }

  // Questo è il metodo che si occupa di navigare alla pagina del profilo dell'artista
  goToArtistProfile(artistId: number, artistName: string): void {
    if (!artistId) {
      console.error('ID artista non valido:', artistId);  // Log per controllare l'ID dell'artista
      return;
    }

    const urlFriendlyName = artistName.replace(/\s+/g, '-').toLowerCase();
    console.log('Navigazione al profilo dell\'artista:', artistId, urlFriendlyName);  // Log per verificare la navigazione

    this.router.navigate([`/artist-profile/${artistId}/${urlFriendlyName}`]);
  }

  // Funzione per mettere in grassetto le lettere corrispondenti alla ricerca
   highlightMatch(artistName: string, query: string): string {
    if (!query) {
      return artistName;
    }
    const regex = new RegExp(`(${query})`, 'gi'); // Crea una regex per trovare la query in modo case-insensitive
    return artistName.replace(regex, '<strong>$1</strong>'); // Sostituisci la query con testo in grassetto e verde
  }

}
