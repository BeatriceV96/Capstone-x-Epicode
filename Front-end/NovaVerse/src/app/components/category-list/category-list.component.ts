import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importa il Router
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
import { AuthService } from '../../services/auth.service';  // Per controllare il ruolo dell'utente

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isArtist: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router  // Aggiungi il Router per il reindirizzamento
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.checkRole();  // Controlla se l'utente è un artista
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Failed to load categories:', error);  // Aggiungi gestione degli errori
      }
    );
  }

  checkRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.isArtist = user.role === 'Artist';  // Verifica se l'utente è un artista
    } else {
      this.isArtist = false;
      this.router.navigate(['/auth/login']);  // Reindirizza alla pagina di login se non autenticato
    }
  }
}
