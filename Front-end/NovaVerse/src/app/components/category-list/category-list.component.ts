import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  isArtist: boolean = false;  // Verifica se l'utente è un artista

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
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
      },
      (error) => {
        this.errorMessage = 'Errore nel caricamento delle categorie';
        this.loading = false;
      }
    );
  }

  navigateToManage(categoryId: number): void {
    console.log('Navigating to:', `/categories/${categoryId}/artworks/manage`);
    this.router.navigate([`/categories/${categoryId}/artworks/manage`]);
  }
}
