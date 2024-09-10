import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
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
  isArtist: boolean = false;  // Definisci se l'utente è un artista

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
      (data: any) => {
        // Se data contiene $values, estrai le categorie da lì
        this.categories = data.$values ? data.$values : data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Errore nel caricamento delle categorie';
        this.loading = false;
      }
    );
  }
}
