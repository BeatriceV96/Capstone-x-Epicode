import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork } from '../../Models/artwork';

@Component({
  selector: 'app-artwork-list',
  templateUrl: './artwork-list.component.html',
  styleUrls: ['./artwork-list.component.scss']
})
export class ArtworkListComponent implements OnInit {
  categoryId: number | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  noArtworks: boolean = false;
  artworks$: Observable<Artwork[]> | undefined;

  constructor(
    private artworkService: ArtworkService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; // Ottieni l'ID della categoria dalla rotta
      if (this.categoryId) {
        this.loadArtworks();
      }
    });
  }

  loadArtworks(): void {
    if (this.categoryId) {
      this.loading = true; // Imposta loading su true prima di iniziare il caricamento
      this.artworks$ = this.artworkService.getArtworksByCategory(this.categoryId).pipe(
        tap((artworks) => {
          console.log('Artworks caricati:', artworks); // Controllo dei dati in console
          this.loading = false; // Imposta loading su false dopo il caricamento
          this.noArtworks = artworks.length === 0; // Controlla se non ci sono opere
        }),
        catchError(error => {
          this.errorMessage = 'Errore nel caricamento delle opere.';
          this.loading = false;
          return of([]); // Restituisce un array vuoto in caso di errore
        })
      );
    }
  }
}
