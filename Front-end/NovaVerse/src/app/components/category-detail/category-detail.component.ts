import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  category: Category | null = null;
  categoryId: number | null = null;
  isArtist: boolean = false;  // Variabile per controllare se l'utente è un artista
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private authService: AuthService  // Servizio di autenticazione
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.loadCategory(this.categoryId);
      }
    });

    // Verifica se l'utente è un artista
    this.isArtist = this.authService.isArtist();
  }

  // Carica i dettagli della categoria
  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe(
      (category: Category) => {
        this.category = category;
        this.errorMessage = null; // Reset dell'errore
      },
      (error) => {
        this.errorMessage = `Errore nel caricamento della categoria con ID ${id}: ${error.message}`;
        console.error('Errore nel caricamento della categoria:', error);
      }
    );
  }
}
