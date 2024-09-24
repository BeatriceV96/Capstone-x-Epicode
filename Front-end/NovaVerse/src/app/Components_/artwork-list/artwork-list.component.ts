import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private allArtworks: Artwork[] = [];

  constructor(
    private artworkService: ArtworkService,
    private route: ActivatedRoute,
    private router: Router
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

          // Converte ogni createDate in un oggetto Date
          this.allArtworks = artworks.map(artwork => {
            return {
              ...artwork,
              createDate: new Date(artwork.createDate) // Assicurati che sia un oggetto Date
            };
          });
        }),
        catchError(error => {
          this.errorMessage = 'Errore nel caricamento delle opere.';
          this.loading = false;
          return of([]); // Restituisce un array vuoto in caso di errore
        })
      );
    }
  }


  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const sortBy = selectElement.value;

    const sortedArtworks = [...this.allArtworks];
    switch (sortBy) {
      case 'priceAsc':
        sortedArtworks.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sortedArtworks.sort((a, b) => b.price - a.price);
        break;
      case 'dateAsc':
        sortedArtworks.sort((a, b) => a.createDate.getTime() - b.createDate.getTime());
        break;
      case 'dateDesc':
        sortedArtworks.sort((a, b) => b.createDate.getTime() - a.createDate.getTime());
        break;
      case 'titleAsc':
        sortedArtworks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        sortedArtworks.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    this.artworks$ = of(sortedArtworks);
  }


  goToCategories(): void {
    this.router.navigate(['/categories']);
  }
}
