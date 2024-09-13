import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CategoryService } from '../services/category.service';
import { Category } from '../Models/category';


@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: Partial<Category> = { name: '', description: '' };
  editing: boolean = false;
  selectedCategoryId: number | null = null;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();  // Carica le categorie all'inizio
  }

  // Carica tutte le categorie
  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap((data: Category[]) => {
        console.log('Categorie ricevute:', data); // Verifica la struttura dei dati
        this.categories = Array.isArray(data) ? data : []; // Assicura che sia un array
        this.success = true;
      }),
      catchError(error => {
        this.message = 'Errore nel caricamento delle categorie';
        this.success = false;
        return of([]);  // Restituisce un array vuoto in caso di errore
      })
    ).subscribe();
  }

  // Aggiungi una nuova categoria
  createCategory(): void {
    if (this.categoryForm.name && this.categoryForm.description) {
      this.loading = true;
      this.categoryService.createCategory(this.categoryForm).pipe(
        tap((newCategory: Category) => {
          this.categories.push(newCategory); // Aggiorna la lista direttamente
          this.message = 'Categoria creata con successo';
          this.success = true;
          this.resetForm();
        }),
        catchError(error => {
          this.message = 'Errore nella creazione della categoria';
          this.success = false;
          return of(null);  // Restituisce null in caso di errore
        })
      ).subscribe().add(() => this.loading = false);  // Fine caricamento
    }
  }

  // Modifica una categoria esistente
  editCategory(category: Category): void {
    this.categoryForm = { name: category.name, description: category.description };
    this.selectedCategoryId = category.id;
    this.editing = true;
  }

  // Salva le modifiche a una categoria
  updateCategory(): void {
    if (this.selectedCategoryId && this.categoryForm.name && this.categoryForm.description) {
      this.loading = true;

      this.categoryService.updateCategory(this.selectedCategoryId, this.categoryForm).pipe(
        tap((updatedCategory: Category) => {
          this.message = 'Categoria aggiornata con successo';
          this.success = true;

          const index = this.categories.findIndex(cat => cat.id === this.selectedCategoryId);
          if (index !== -1) {
            this.categories[index] = updatedCategory;  // Aggiorna la categoria nell'array locale
          }
          this.resetForm();
        }),
        catchError(error => {
          this.message = 'Errore durante l\'aggiornamento della categoria';
          this.success = false;
          return of(null);  // Restituisce null in caso di errore
        })
      ).subscribe().add(() => this.loading = false);  // Fine caricamento
    }
  }

  // Elimina una categoria
  deleteCategory(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa categoria?')) {
      this.loading = true;
      this.categoryService.deleteCategory(id).pipe(
        tap(() => {
          console.log('Categoria eliminata:', id); // Log per il debug
          this.categories = this.categories.filter(cat => cat.id !== id);  // Rimuovi la categoria dall'array locale
          this.message = 'Categoria eliminata con successo';
          this.success = true;
        }),
        catchError(error => {
          console.error('Errore durante l\'eliminazione della categoria:', error); // Log per il debug
          this.message = error.error.message || 'Errore durante l\'eliminazione della categoria';
          this.success = false;
          return of(null);  // Restituisce null in caso di errore
        })
      ).subscribe().add(() => this.loading = false);  // Fine caricamento
    }
  }

  // Resetta il form e lo stato
  resetForm(): void {
    this.categoryForm = { name: '', description: '' };
    this.selectedCategoryId = null;
    this.editing = false;
    this.message = '';
  }
}
