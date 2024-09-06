import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Per ottenere l'ID della categoria dalla rotta
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Models/category';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  category: Category | null = null;  // Categoria attuale
  categoryId: number | null = null;

  constructor(private route: ActivatedRoute, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];  // Prende l'ID dalla rotta
      if (this.categoryId) {
        this.loadCategory(this.categoryId);
      }
    });
  }

  // Carica i dettagli di una categoria dall'ID
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
}
