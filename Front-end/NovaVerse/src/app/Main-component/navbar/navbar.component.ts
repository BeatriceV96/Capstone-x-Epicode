import { Component, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { iUser } from '../../Models/i-user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap, filter } from 'rxjs/operators';
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
  isOpen: boolean = false; // Indica se la barra di ricerca è aperta

  constructor(
    private authService: AuthService,
    private router: Router,
    private artistService: ArtistService,
    private eRef: ElementRef
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
    // Ascolta gli eventi di navigazione per chiudere la barra di ricerca
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  // Verifica che l'evento sia NavigationEnd
    ).subscribe(() => {
      this.closeSearch();  // Chiude la barra di ricerca dopo la navigazione
    });
  }


  // Metodo per controllare se l'utente è loggato
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  // Metodo per eseguire il logout
  onLogout(): void {
    this.authService.logout();
  }


  openSearch(): void {
    this.isOpen = true;
  }

  closeSearch(): void {
    this.isOpen = false;
    this.clearSearch();  // Pulisci la query quando la barra viene chiusa
  }

   // Metodo per aggiornare la query di ricerca
   onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.next(query); // Aggiorna il BehaviorSubject con il nuovo valore
    if (query.length > 0) {
      this.searchArtists(query); // Inizia la ricerca se la query non è vuota
    } else {
      this.clearSearch(); // Se la query è vuota, nascondi i suggerimenti
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    // Verifica se il clic è avvenuto fuori dalla barra di ricerca
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeSearch();
    }
  }

  // Metodo per cancellare la ricerca
  clearSearch(): void {
    this.searchQuery.next(''); // Resetta il BehaviorSubject
    this.suggestedArtists$ = of([]); // Nascondi i suggerimenti
  }

   // Metodo per cercare gli artisti
   searchArtists(query: string): void {
    if (query.length === 0) {
      this.suggestedArtists$ = of([]); // Svuota i suggerimenti se non c'è query
      return;
    }

    this.loading = true; // Mostra il loader durante la ricerca
    this.artistService.searchArtists(query).subscribe(
      (artists) => {
        this.suggestedArtists$ = of(artists); // Aggiorna i suggerimenti
        this.loading = false; // Nascondi il loader
      },
      (error) => {
        console.error('Errore nella ricerca degli artisti:', error);
        this.suggestedArtists$ = of([]); // Svuota i suggerimenti in caso di errore
        this.loading = false;
      }
    );
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
