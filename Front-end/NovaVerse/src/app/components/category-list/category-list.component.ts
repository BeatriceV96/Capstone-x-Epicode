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
  loading: boolean = true;  // Variabile per indicare lo stato di caricamento
  errorMessage: string | null = null;  // Variabile per gestire eventuali errori

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router  // Aggiungi il Router per il reindirizzamento
  ) {}

  ngOnInit(): void {
    this.checkRole();  // Verifica il ruolo dell'utente prima di caricare le categorie
    this.loadCategories();
  }

  // Carica le categorie
loadCategories(): void {
  this.loading = true;
  console.log('Inizio chiamata per ottenere le categorie...');
  this.categoryService.getAllCategories().subscribe(
    (data: Category[]) => {
      console.log('Categorie caricate correttamente:', data);
      this.categories = data;
      this.loading = false;  // Fine caricamento
    },
    (error) => {
      this.errorMessage = 'Errore durante il caricamento delle categorie.';
      console.error('Errore nel caricamento delle categorie:', error);
      this.loading = false;  // Fine caricamento, ma con errore
    }
  );
}


  // Verifica il ruolo dell'utente e reindirizza se non autenticato
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
