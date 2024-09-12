import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa il Router
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ArtworkService } from '../../services/artwork.service'; // Importa il servizio ArtworkService
import { Category } from '../../Models/category';
import { Artwork } from '../../Models/artwork';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  artworksByCategory: { [categoryId: number]: Artwork[] } = {}; // Oggetto per memorizzare le opere per categoria
  loading: boolean = true;
  errorMessage: string | null = null;
  isArtist: boolean = false;  // Verifica se l'utente è un artista

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private artworkService: ArtworkService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isArtist = this.authService.isArtist();
    this.loadCategories();
  }

  // Carica tutte le categorie
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.loading = false;
      this.loadArtworksForCategories(); // Carica le opere per ciascuna categoria
    }, error => {
      this.errorMessage = 'Errore nel caricamento delle categorie';
      this.loading = false;
    });
  }

  // Carica le opere per ciascuna categoria
  loadArtworksForCategories(): void {
    this.categories.forEach(category => {
      this.artworkService.getArtworksByCategory(category.id).subscribe(artworks => {
        this.artworksByCategory[category.id] = artworks;
      }, error => {
        console.error(`Errore nel caricamento delle opere per la categoria ${category.name}`, error);
      });
    });
  }

  // Funzione per la navigazione alla gestione delle opere
  navigateToManage(categoryId: number): void {
    this.router.navigate([`/categories/${categoryId}/artworks/manage`]); // Naviga alla rotta specificata
  }
}
