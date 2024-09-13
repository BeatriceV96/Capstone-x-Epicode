import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Category } from '../../Models/category';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  isArtist: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isArtist = this.authService.isArtist(); // Verifica se l'utente è un artista
    this.loadCategories(); // Carica tutte le categorie
  }

  // Funzione per caricare tutte le categorie
  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      catchError(error => {
        this.errorMessage = 'Errore nel caricamento delle categorie';
        this.loading = false;
        return of([]);
      })
    ).subscribe(categories => {
      this.categories = categories;
      this.loading = false;
    });
  }

  // Naviga alla lista delle opere per una determinata categoria
  viewCategoryArtworks(categoryId: number): void {
    this.router.navigate([`/categories/${categoryId}/artworks`]);
  }

  // Funzione per la navigazione alla gestione delle opere
  navigateToManage(categoryId: number): void {
    this.router.navigate([`/categories/${categoryId}/artworks/manage`]);
  }
}
