import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork } from '../../Models/artwork';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artwork-list',
  templateUrl: './artwork-list.component.html',
  styleUrls: ['./artwork-list.component.scss']
})
export class ArtworkListComponent implements OnInit {
  artworks$: Observable<Artwork[]> = new Observable<Artwork[]>();
  categoryId: number | null = null;
  categoryName: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private artworkService: ArtworkService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; // Ottiene l'ID della categoria dai parametri URL
      if (this.categoryId) {
        this.loadArtworks(); // Carica le opere per la categoria specifica
      }
    });
  }

  loadArtworks(): void {
    if (this.categoryId) {
      this.loading = true;
      this.artworks$ = this.artworkService.getArtworksByCategory(this.categoryId); // Utilizza l'Observable artworks$
      this.artworks$.subscribe({
        next: () => {
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Errore nel caricamento delle opere per la categoria selezionata.';
          console.error(err);
        }
      });
    }
  }
}
