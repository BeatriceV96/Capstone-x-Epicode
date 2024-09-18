import { Component, OnInit } from '@angular/core';
import { Favorite } from '../../Models/favorite';
import { catchError, Observable, tap } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.scss'
})
export class FavoriteListComponent implements OnInit {
  favorites$: Observable<Favorite[]> | undefined;


  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favorites$ = this.favoriteService.getUserFavorites().pipe(
      tap((favorites) => {
        console.log('Preferiti caricati:', favorites);
      }
    ),
    catchError(error => {
      console.error('Errore nel caricamento dei preferiti:', error);
      return [];
    }
  ));
  }

  removeFromFavorites(favoriteId: number): void {
    this.favoriteService.removeFavorite(favoriteId);
  }
}
