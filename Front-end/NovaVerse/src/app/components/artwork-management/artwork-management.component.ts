import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork, ArtworkType } from '../../Models/artwork';
import { catchError, Observable, of, tap } from 'rxjs';
import { Category } from '../../Models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-artwork-management',
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.scss']
})
export class ArtworkManagementComponent implements OnInit {
deleteCategory(arg0: number) {
throw new Error('Method not implemented.');
}
editCategory(_t84: Category) {
throw new Error('Method not implemented.');
}
  artworks$: Observable<Artwork[]> = new Observable<Artwork[]>();
  categoryId: number | null | undefined;
  categories: Category[] = [];
  artworkForm: Partial<Artwork> = { title: '', description: '', price: 0, categoryId: undefined, imageUrl: '' };
  editing: boolean = false;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;
  selectedArtworkId: number | null = null;
  selectedFile: File | null = null;

  ArtworkType = ArtworkType;

  constructor(
    private artworkService: ArtworkService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.artworks$ = this.artworkService.artworks$; // Assicurati che stai usando l'observable del servizio
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap((data: Category[]) => {
        this.categories = data;
      }),
      catchError(error => {
        this.message = 'Errore nel caricamento delle categorie';
        this.success = false;
        return of([]);
      })
    ).subscribe();
  }

  createArtwork(): void {
    const formData = new FormData();

    if (this.artworkForm.title) {
      formData.append('title', this.artworkForm.title);
    }
    if (this.artworkForm.description) {
      formData.append('description', this.artworkForm.description);
    }
    if (this.artworkForm.price) {
      formData.append('price', this.artworkForm.price.toString());
    }
    if (this.artworkForm.categoryId) {
      formData.append('categoryId', this.artworkForm.categoryId.toString());
    }
    if (this.artworkForm.type) {
      formData.append('type', this.artworkForm.type);
    }

    if (this.selectedFile) {
      formData.append('photoFile', this.selectedFile);
    } else {
      this.message = 'Seleziona un file immagine per continuare';
      return;
    }

    this.artworkService.createArtwork(formData).subscribe(
      (response) => {
        console.log('Opera creata con successo', response);
        this.message = 'Opera creata con successo';
        this.success = true;
        this.resetForm(); // Resetta il form dopo la creazione
        this.loadArtworks(); // Ricarica le opere per vedere i cambiamenti in tempo reale
      },
      (error) => {
        console.error('Errore durante la creazione dell\'opera', error);
        this.message = 'Errore durante la creazione dell\'opera';
        this.success = false;
      }
    );
  }

  editArtwork(artwork: Artwork): void {
    this.artworkForm = { title: artwork.title, description: artwork.description, price: artwork.price, categoryId: artwork.categoryId, imageUrl: artwork.imageUrl };
    this.selectedArtworkId = artwork.id;
    this.editing = true;
  }

  updateArtwork(): void {
    if (this.selectedArtworkId && this.artworkForm.title && this.artworkForm.description) {
      this.loading = true;
      const formData = new FormData();
      formData.append('title', this.artworkForm.title!);
      formData.append('description', this.artworkForm.description!);
      formData.append('price', this.artworkForm.price!.toString());
      formData.append('categoryId', this.artworkForm.categoryId!.toString());

      if (this.selectedFile) {
        formData.append('photoFile', this.selectedFile);
      } else if (this.artworkForm.imageUrl) {
        formData.append('imageUrl', this.artworkForm.imageUrl!);
      }

      this.artworkService.updateArtwork(this.selectedArtworkId, formData).pipe(
        tap(() => {
          this.message = 'Opera aggiornata con successo';
          this.success = true;
          this.resetForm();
          this.loading = false;
          this.loadArtworks(); // Ricarica le opere per vedere i cambiamenti in tempo reale
        }),
        catchError((error) => {
          this.message = 'Errore durante l\'aggiornamento dell\'opera';
          this.success = false;
          this.loading = false;
          return of(null);
        })
      ).subscribe();
    }
  }

  deleteArtwork(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa opera?')) {
      this.loading = true;
      this.artworkService.deleteArtwork(id).pipe(
        tap(() => {
          this.message = 'Opera eliminata con successo';
          this.success = true;
          this.loading = false;
          this.loadArtworks(); // Ricarica le opere per vedere i cambiamenti in tempo reale
        }),
        catchError((error) => {
          this.message = 'Errore durante l\'eliminazione dell\'opera';
          this.success = false;
          this.loading = false;
          return of(null);
        })
      ).subscribe();
    }
  }

  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined, imageUrl: '' };
    this.selectedFile = null;
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
        this.artworkForm.imageUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
}
