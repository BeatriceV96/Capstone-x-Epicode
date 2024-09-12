import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.isArtist = this.authService.isArtist();  // Verifica se l'utente è un artista
  }

  // Carica tutte le categorie
  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.loading = false;

        // Per ogni categoria, carica le opere associate
        this.categories.forEach(category => {
          this.loadArtworksByCategory(category.id);
        });
      },
      (error) => {
        this.errorMessage = 'Errore nel caricamento delle categorie';
        this.loading = false;
      }
    );
  }

  // Carica le opere associate a una categoria specifica
  loadArtworksByCategory(categoryId: number): void {
    this.categoryService.getArtworksByCategory(categoryId).subscribe(
      (artworks: Artwork[]) => {
        this.artworksByCategory[categoryId] = artworks; // Memorizza le opere per la categoria
      },
      (error) => {
        console.error(`Errore nel caricamento delle opere per la categoria ${categoryId}`, error);
        this.artworksByCategory[categoryId] = []; // In caso di errore, imposta un array vuoto
      }
    );
  }

  // Funzione per la navigazione alla gestione delle opere
  navigateToManage(categoryId: number): void {
    console.log('Navigating to:', `/categories/${categoryId}/artworks/manage`);
    // Implementazione della logica di navigazione
  }
}
