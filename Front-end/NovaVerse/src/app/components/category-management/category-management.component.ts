import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';
import { AuthService } from '../../services/auth.service';  // Per controllare il ruolo dell'utente

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: Partial<Category> = { name: '', description: '' };  // Modello per il form
  editing: boolean = false;  // Flag per capire se stiamo modificando o creando
  selectedCategoryId: number | null = null;

  constructor(private categoryService: CategoryService, private authService: AuthService) {}

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
        console.error('Failed to load categories:', error);
      }
    );
  }

  // Aggiungi una nuova categoria
  createCategory(): void {
    if (this.categoryForm.name && this.categoryForm.description) {
      this.categoryService.createCategory(this.categoryForm).subscribe(
        () => {
          this.loadCategories();
          this.resetForm();
        },
        (error) => {
          console.error('Failed to create category:', error);
        }
      );
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
      this.categoryService.updateCategory(this.selectedCategoryId, this.categoryForm).subscribe(
        () => {
          this.loadCategories();
          this.resetForm();
        },
        (error) => {
          console.error('Failed to update category:', error);
        }
      );
    }
  }

  // Elimina una categoria
  deleteCategory(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa categoria?')) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
        },
        (error) => {
          console.error('Failed to delete category:', error);
        }
      );
    }
  }

  // Resetta il form
  resetForm(): void {
    this.categoryForm = { name: '', description: '' };
    this.selectedCategoryId = null;
    this.editing = false;
  }
}
