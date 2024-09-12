import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Aggiungi Router per la navigazione
import { ArtworkService } from '../../services/artwork.service';
import { AuthService } from '../../services/auth.service';
import { Artwork } from '../../Models/artwork';
import { CategoryService } from '../../services/category.service'; // Importa il CategoryService

@Component({
  selector: 'app-artwork-list',
  templateUrl: './artwork-list.component.html',
  styleUrls: ['./artwork-list.component.scss']
})
export class ArtworkListComponent implements OnInit {
  artworks: Artwork[] = [];
  categoryId: number | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  isArtist: boolean = false;
  categoryName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Aggiungi il Router qui
    private artworkService: ArtworkService,
    private categoryService: CategoryService, // Aggiungi il CategoryService
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Recupera i parametri della rotta
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; // Prende l'ID della categoria dalla rotta
      if (this.categoryId) {
        this.loadArtworks(this.categoryId);   // Carica le opere associate alla categoria
        this.loadCategoryDetails(this.categoryId); // Carica i dettagli della categoria
      }
    });
    this.isArtist = this.authService.isArtist();  // Verifica se l'utente è un artista
  }

  // Carica le opere della categoria
  loadArtworks(categoryId: number): void {
    this.loading = true;
    this.artworkService.getArtworksByCategory(categoryId).subscribe(
      (artworks: Artwork[]) => {
        this.artworks = artworks;   // Imposta la lista delle opere
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Errore nel caricamento delle opere';
        this.loading = false;
      }
    );
  }

  // Carica i dettagli della categoria (come il nome)
  loadCategoryDetails(categoryId: number): void {
    this.categoryService.getCategoryById(categoryId).subscribe(
      (category) => {
        this.categoryName = category.name; // Imposta il nome della categoria
      },
      (error) => {
        this.errorMessage = 'Errore nel caricamento della categoria';
      }
    );
  }

  // Aggiungi questo metodo per navigare alla pagina di gestione opere
  navigateToManage(): void {
    if (this.categoryId) {
      this.router.navigate([`/categories/${this.categoryId}/artworks/manage`]);
    }
  }
}
