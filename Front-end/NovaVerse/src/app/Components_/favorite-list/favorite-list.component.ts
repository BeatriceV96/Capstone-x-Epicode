import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../Models/favorite';
import { catchError, Observable, tap } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      state('out', style({ opacity: 0, transform: 'scale(0)' })),
      transition('in => out', [
        animate('0.5s ease-out')
      ]),
      transition('out => in', [
        animate('0.5s ease-in')
      ])
    ])
  ]
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

   // Metodo per rimuovere un preferito con animazione
   removeFromFavorites(favorite: Favorite): void {
    favorite.removing = true; // Attiva l'animazione

    setTimeout(() => {
      this.favoriteService.removeFavorite(favorite.id); // Rimuove l'elemento dopo l'animazione
    }, 500); // Delay per l'animazione (500ms per completare l'effetto fadeOut)
  }
}
