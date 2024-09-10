import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Importa Router
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
  isArtist: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,  // Aggiungi il Router
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.loadCategory(this.categoryId);
      }
    });

    this.isArtist = this.authService.isArtist();
  }

  // Carica i dettagli della categoria
  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe(
      (category: Category) => {
        this.category = category;
      },
      (error) => {
        console.error('Errore nel caricamento della categoria:', error);
      }
    );
  }

  // Funzione per gestire il click sulla matita per andare alla pagina di gestione opere
  manageArtworks(): void {
    if (this.categoryId) {
      this.router.navigate(['/categories', this.categoryId, 'artworks/manage']);
    }
  }
}
