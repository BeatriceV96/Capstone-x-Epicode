import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FavoriteService } from '../../../services/favorite.service';
import { Favorite } from '../../../Models/favorite';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss']
})
export class FavoritesListComponent implements OnInit {
  favorites$: Observable<Favorite[]> | undefined;
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verifica se l'utente è autenticato
    if (this.authService.isAuthenticated()) {
      // Se l'utente è autenticato, recupera la lista dei preferiti
      this.loadFavorites();
    } else {
      // Se l'utente non è autenticato, reindirizzalo alla pagina di login
      this.router.navigate(['/auth/login']);
    }
  }

  loadFavorites(): void {
    this.loading = true;
    this.favorites$ = this.favoriteService.getUserFavorites().pipe(
      tap((favorites) => {
        this.loading = false;
        console.log('Favorites loaded:', favorites); // Log per verificare i dati
      }),
      catchError((error) => {
        this.errorMessage = 'Errore nel caricamento dei preferiti';
        this.loading = false;
        return of([]);
      })
    );
  }

  removeFromFavorites(favoriteId: number): void {
    this.favoriteService.removeFavorite(favoriteId).subscribe(
      () => {
        this.loadFavorites(); // Ricarica la lista dei preferiti dopo la rimozione
      },
      (error) => {
        console.error('Errore durante la rimozione del preferito', error);
      }
    );
  }
}
