import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { CategoryService } from '../../services/category.service';
import { Artwork } from '../../Models/artwork';
import { Category } from '../../Models/category';

@Component({
  selector: 'app-artwork-management',
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.scss']
})
export class ArtworkManagementComponent implements OnInit {
  artworks: Artwork[] = [];
  categories: Category[] = [];
  artworkForm: Partial<Artwork> = { title: '', description: '', price: 0, categoryId: undefined };
  selectedArtworkId: number | null = null;
  editing: boolean = false;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadArtworks();
    this.loadCategories();
  }

  loadArtworks(): void {
    this.loading = true;
    this.artworkService.getAllArtworks().subscribe(
      (data: Artwork[]) => {
        this.artworks = data;
        this.loading = false;
      },
      (error) => {
        this.message = 'Errore nel caricamento delle opere';
        this.success = false;
        this.loading = false;
      }
    );
  }

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

  createArtwork(): void {
    if (this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId) {
      this.loading = true;
      this.artworkService.createArtwork(this.artworkForm).subscribe(
        (newArtwork: Artwork) => {
          this.artworks.push(newArtwork);
          this.message = 'Opera creata con successo';
          this.success = true;
          this.resetForm();
          this.loading = false;
        },
        (error) => {
          this.message = 'Errore nella creazione dell\'opera';
          this.success = false;
          this.loading = false;
        }
      );
    }
  }

  editArtwork(artwork: Artwork): void {
    this.artworkForm = { ...artwork };
    this.selectedArtworkId = artwork.id;
    this.editing = true;
  }

  updateArtwork(): void {
    if (this.selectedArtworkId && this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId) {
      this.loading = true;
      this.artworkService.updateArtwork(this.selectedArtworkId, this.artworkForm).subscribe(
        () => {
          this.message = 'Opera aggiornata con successo';
          this.success = true;
          this.loadArtworks(); // Ricarica le opere
          this.resetForm();
          this.loading = false;
        },
        (error) => {
          this.message = 'Errore nell\'aggiornamento dell\'opera';
          this.success = false;
          this.loading = false;
        }
      );
    }
  }

  deleteArtwork(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa opera?')) {
      this.loading = true;
      this.artworkService.deleteArtwork(id).subscribe(
        () => {
          this.message = 'Opera eliminata con successo';
          this.success = true;
          this.artworks = this.artworks.filter(a => a.id !== id); // Rimuovi l'opera dall'array
          this.loading = false;
        },
        (error) => {
          this.message = 'Errore nell\'eliminazione dell\'opera';
          this.success = false;
          this.loading = false;
        }
      );
    }
  }

  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined };
    this.selectedArtworkId = null;
    this.editing = false;
    this.message = '';
  }
}
