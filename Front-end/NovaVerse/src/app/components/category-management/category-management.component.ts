import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
import { Router } from '@angular/router';  // Importa Router

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
  loading: boolean = false;  // Flag per il caricamento
  message: string = '';  // Messaggio di successo o errore
  success: boolean = true;  // Stato del successo del messaggio

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Carica tutte le categorie
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        this.message = 'Errore nel caricamento delle categorie';
        this.success = false;
      }
    );
  }

  // Aggiungi una nuova categoria
  createCategory(): void {
    if (this.categoryForm.name && this.categoryForm.description) {
      this.loading = true;
      this.categoryService.createCategory(this.categoryForm).subscribe(
        (newCategory) => {
          this.message = 'Categoria creata con successo';
          this.success = true;

          // Reindirizza alla pagina della categoria appena creata
          this.router.navigate([`/categories/${newCategory.id}`]);

          this.resetForm();
        },
        (error) => {
          this.message = 'Errore nella creazione della categoria';
          this.success = false;
        }
      ).add(() => this.loading = false);  // Fine del caricamento
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
      this.categoryService.updateCategory(this.selectedCategoryId, this.categoryForm).subscribe(
        (updatedCategory) => {
          this.message = 'Categoria aggiornata con successo';
          this.success = true;

          // Trova l'indice della categoria da aggiornare
          const index = this.categories.findIndex(cat => cat.id === this.selectedCategoryId);

          // Aggiorna la categoria nell'array locale
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }

          this.resetForm();
        },
        (error) => {
          this.message = 'Errore nell\'aggiornamento della categoria';
          this.success = false;
        }
      ).add(() => this.loading = false);
    }
  }

  // Elimina una categoria
  deleteCategory(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa categoria?')) {
      this.loading = true;
      this.categoryService.deleteCategory(id).subscribe(
        (response) => {
          this.message = 'Categoria eliminata con successo';
          this.success = true;

          // Rimuovi la categoria dall'array locale
          this.categories = this.categories.filter(cat => cat.id !== id);
        },
        (error) => {
          this.message = 'Errore nell\'eliminazione della categoria';
          this.success = false;
        }
      ).add(() => this.loading = false);
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
