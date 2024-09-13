import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { CategoryService } from '../../services/category.service';
import { Artwork } from '../../Models/artwork';
import { Category } from '../../Models/category';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-artwork-management',
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.scss']
})
export class ArtworkManagementComponent implements OnInit {
  artworks$: Observable<Artwork[]> = new Observable<Artwork[]>();
  categories: Category[] = [];
  artworkForm: Partial<Artwork> = { title: '', description: '', price: 0, categoryId: undefined, imageUrl: '' };
  editing: boolean = false;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;
  selectedArtworkId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;  // Variabile per mostrare l'anteprima dell'immagine

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.artworks$ = this.artworkService.artworks$;
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap((data: Category[]) => this.categories = data),
      catchError(() => {
        this.message = 'Errore nel caricamento delle categorie';
        this.success = false;
        return of([]);
      })
    ).subscribe();
  }

  createArtwork(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.artworkForm.title || '');
      formData.append('description', this.artworkForm.description || '');
      formData.append('price', String(this.artworkForm.price));
      formData.append('categoryId', String(this.artworkForm.categoryId));
      formData.append('type', this.artworkForm.type || '');
      formData.append('photoFile', this.selectedFile);

      this.artworkService.createArtwork(formData).subscribe(
        () => {
          this.message = 'Opera creata con successo';
          this.success = true;
          this.resetForm();
          this.loadArtworks();
        },
        () => {
          this.message = 'Errore durante la creazione dell\'opera';
          this.success = false;
        }
      );
    } else {
      this.message = 'Seleziona un file immagine per continuare';
    }
  }

  editArtwork(artwork: Artwork): void {
    this.artworkForm = { ...artwork };
    this.selectedArtworkId = artwork.id;
    this.imagePreview = artwork.imageUrl || artwork.photo || null;
    this.editing = true;
  }

  updateArtwork(): void {
    if (this.selectedArtworkId && this.artworkForm.title && this.artworkForm.description) {
      const formData = new FormData();
      formData.append('title', this.artworkForm.title);
      formData.append('description', this.artworkForm.description);
      formData.append('price', String(this.artworkForm.price));
      formData.append('categoryId', String(this.artworkForm.categoryId));
      formData.append('type', this.artworkForm.type || '');

      if (this.selectedFile) {
        formData.append('photoFile', this.selectedFile);
      }

      this.artworkService.updateArtwork(this.selectedArtworkId, formData).subscribe(
        () => {
          this.message = 'Opera aggiornata con successo';
          this.success = true;
          this.resetForm();
          this.loadArtworks();
        },
        () => {
          this.message = 'Errore durante l\'aggiornamento dell\'opera';
          this.success = false;
        }
      );
    }
  }

  deleteArtwork(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa opera?')) {
      this.artworkService.deleteArtwork(id).subscribe(
        () => {
          this.message = 'Opera eliminata con successo';
          this.success = true;
          this.loadArtworks();
        },
        () => {
          this.message = 'Errore durante l\'eliminazione dell\'opera';
          this.success = false;
        }
      );
    }
  }

  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined, imageUrl: '' };
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedArtworkId = null;
    this.editing = false;
    this.message = '';
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
