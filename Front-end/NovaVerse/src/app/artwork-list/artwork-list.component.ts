import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ArtworkService } from '../services/artwork.service';
import { Artwork } from '../Models/artwork';

@Component({
  selector: 'app-artwork-list',
  templateUrl: './artwork-list.component.html',
  styleUrls: ['./artwork-list.component.scss']
})
export class ArtworkListComponent implements OnInit {
  artworks$: Observable<Artwork[]> = new Observable<Artwork[]>();
  categoryId: number | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;

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
      this.artworks$ = this.artworkService.getArtworksByCategory(this.categoryId).pipe(
        tap((artworks) => {
          console.log('Artworks caricati:', artworks); // Log dei dati ricevuti
        }),
        catchError(error => {
          this.errorMessage = 'Errore nel caricamento delle opere.';
          this.loading = false;
          return of([]);
        })
      );
      this.loading = false;
    }
  }
}
