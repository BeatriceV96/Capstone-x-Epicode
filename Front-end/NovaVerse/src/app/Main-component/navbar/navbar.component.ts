import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { iUser } from '../../Models/i-user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap, filter } from 'rxjs/operators';
import { ArtistService } from '../../services/artist.service';
import { MessageService } from '../../services/message-service.service';
import { NotificationService } from '../../services/notification-service.service';
import { Message } from '../../Models/message';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  searchQuery = new BehaviorSubject<string>(''); // Variabile per tracciare la ricerca
  suggestedArtists$: Observable<iUser[]>; // Osservabile per i suggerimenti degli artisti
  artist: iUser | null = null; // Variabile per gestire il profilo dell'artista
  loading = false; // Variabile per gestire lo stato di caricamento
  isOpen: boolean = false; // Indica se la barra di ricerca è aperta
  unreadNotifications: number = 0; // Numero notifiche non lette
  notifications: any[] = []; // Lista notifiche
  showNotifications: boolean = false; // Mostra/nasconde il pannello
  userId: number | null = null; // ID utente autenticato
  unreadMessages: number = 0;



  constructor(
    private authService: AuthService,
    private router: Router,
    private artistService: ArtistService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private eRef: ElementRef
  ) {
    this.suggestedArtists$ = this.searchQuery.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        query.trim() !== ''
          ? this.artistService.searchArtists(query).pipe(
              tap((artists) => console.log('Artists found:', artists)),
              catchError((error) => {
                console.error('Errore nella ricerca degli artisti:', error);
                return of([]);
              })
            )
          : of([])
      )
    );

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeSearch();
      });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.loadUnreadMessages();
    } else {
      console.error('Utente non autenticato');
    }
  }


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogout(): void {
    this.authService.logout();
  }

  openSearch(): void {
    this.isOpen = true;
  }

  closeSearch(): void {
    this.isOpen = false;
    this.clearSearch();
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.next(query);
    if (query.length > 0) {
      this.searchArtists(query);
    } else {
      this.clearSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery.next('');
    this.suggestedArtists$ = of([]);
  }

  searchArtists(query: string): void {
    if (query.length === 0) {
      this.suggestedArtists$ = of([]);
      return;
    }

    this.loading = true;
    this.artistService.searchArtists(query).subscribe(
      (artists) => {
        this.suggestedArtists$ = of(artists);
        this.loading = false;
      },
      (error) => {
        console.error('Errore nella ricerca degli artisti:', error);
        this.suggestedArtists$ = of([]);
        this.loading = false;
      }
    );
  }

  goToArtistProfile(artistId: number, artistName: string): void {
    if (!artistId) {
      console.error('ID artista non valido:', artistId);
      return;
    }

    const urlFriendlyName = artistName.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate([`/artist-profile/${artistId}/${urlFriendlyName}`]);
  }

  highlightMatch(artistName: string, query: string): string {
    if (!query) {
      return artistName;
    }
    const regex = new RegExp(`(${query})`, 'gi');
    return artistName.replace(regex, '<strong>$1</strong>');
  }

  loadUnreadMessages(): void {
    if (!this.userId) {
      console.error('ID utente non valido.');
      return;
    }

    this.messageService.getUnreadMessages(this.userId).subscribe({
      next: (messages: Message[]) => {
        console.log('Messaggi non letti caricati con successo:', messages); // Verifica
        this.unreadMessages = messages.length; // Aggiorna il conteggio
      },
      error: (err: any) => {
        console.error('Errore durante il caricamento dei messaggi non letti:', err);
      }
    });
  }


  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

 // Mostra/nasconde il pannello delle notifiche
 toggleNotifications(): void {
  this.showNotifications = !this.showNotifications;

  if (this.showNotifications && this.notifications.length > 0) {
    // Segna tutte le notifiche come lette
    this.markAllNotificationsAsRead();
  }
}


markAllNotificationsAsRead(): void {
  const notificationIds = this.notifications.map((n) => n.id); // Ottieni tutti gli ID
  if (!notificationIds || notificationIds.length === 0) {
    console.warn('Nessuna notifica da marcare come letta.');
    return;
  }

  this.notificationService.markAllNotificationsAsRead(notificationIds).subscribe({
    next: () => {
      console.log('Tutte le notifiche sono state marcate come lette.');
      this.unreadNotifications = 0;
    },
    error: (err) => {
      console.error('Errore nel marcare tutte le notifiche come lette:', err);
    },
  });
}

markNotificationAsRead(notificationId: number): void {
  this.notificationService.markNotificationAsRead(notificationId).subscribe({
    next: () => {
      console.log(`Notifica con ID ${notificationId} marcata come letta.`);
      this.unreadNotifications -= 1; // Aggiorna il conteggio
    },
    error: (err) => {
      console.error(`Errore nel marcare la notifica con ID ${notificationId} come letta:`, err);
    },
  });
}


}
