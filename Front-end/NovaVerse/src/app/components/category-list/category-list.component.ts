import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ArtworkService } from '../../services/artwork.service'; // Import the ArtworkService
import { Category } from '../../Models/category';
import { Artwork } from '../../Models/artwork';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  artworksByCategory: { [categoryId: number]: Artwork[] } = {};
  loading: boolean = true;
  errorMessage: string | null = null;
  isArtist: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private artworkService: ArtworkService, // Inject the ArtworkService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isArtist = this.authService.isArtist(); // Verifica se l'utente è un artista
    this.loadCategories(); // Carica tutte le categorie
    this.loadArtworks(); // Carica tutte le opere d'arte
  }

  // Funzione per caricare tutte le categorie
  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap((data: Category[]) => {
        this.categories = data;
        this.loading = false;
      }),
      catchError(error => {
        this.errorMessage = 'Errore nel caricamento delle categorie';
        this.loading = false;
        return of([]);
      })
    ).subscribe();
  }

  // Funzione per caricare tutte le opere d'arte
  loadArtworks(): void {
    this.artworkService.artworks$.pipe(
      tap((artworks: Artwork[]) => {
        this.artworksByCategory = this.groupArtworksByCategory(artworks);
      }),
      catchError(error => {
        this.errorMessage = 'Errore nel caricamento delle opere d\'arte';
        return of([]);
      })
    ).subscribe();
  }

  // Funzione per raggruppare le opere d'arte per categoria
  groupArtworksByCategory(artworks: Artwork[]): { [categoryId: number]: Artwork[] } {
    const grouped: { [categoryId: number]: Artwork[] } = {};
    artworks.forEach(artwork => {
      if (!grouped[artwork.categoryId]) {
        grouped[artwork.categoryId] = [];
      }
      grouped[artwork.categoryId].push(artwork);
    });
    return grouped;
  }

  // Funzione per la navigazione alla gestione delle opere
  navigateToManage(categoryId: number): void {
    this.router.navigate([`/categories/${categoryId}/artworks/manage`]);
  }
}
