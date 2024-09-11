import { ArtworkType } from './../../Models/artwork';
import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { CategoryService } from '../../services/category.service';
import { Artwork } from '../../Models/artwork';
import { Category } from '../../Models/category';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artwork-management',
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.scss']
})

export class ArtworkManagementComponent implements OnInit {
  artworks: Artwork[] = [];
  categories: Category[] = [];
  artworkForm: Partial<Artwork> = {
    title: '',
    description: '',
    price: 0,
    categoryId: undefined,
    type: ArtworkType.Opere
  };
  selectedFiles: File[] = [];
  editing: boolean = false;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;
  selectedArtworkId: number | null = null;

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadArtworks();
  }

  // Carica tutte le categorie per il dropdown
  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap((categories: Category[]) => {
        this.categories = categories;
      }),
      catchError(error => {
        this.message = 'Errore nel caricamento delle categorie';
        this.success = false;
        return of([]);
      })
    ).subscribe();
  }

  // Carica tutte le opere
  loadArtworks(): void {
    this.route.params.subscribe(params => {
      const categoryId = +params['id'];
      if (categoryId) {
        this.artworkService.getArtworksByCategory(categoryId).pipe(
          tap((artworks: Artwork[]) => {
            this.artworks = artworks;
          }),
          catchError(error => {
            this.message = 'Errore nel caricamento delle opere';
            this.success = false;
            return of([]);
          })
        ).subscribe();
      }
    });
  }

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }


  // Crea una nuova opera
  createArtwork(): void {
    if (this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId && this.selectedFiles.length > 0) {
        this.loading = true;

        const formData = new FormData();
        formData.append('title', this.artworkForm.title!); // Assicura che il titolo non sia undefined
        formData.append('description', this.artworkForm.description!); // Assicura che la descrizione non sia undefined
        formData.append('price', this.artworkForm.price!.toString()); // Assicura che il prezzo non sia undefined
        formData.append('categoryId', this.artworkForm.categoryId!.toString()); // Asserzione non-null
        formData.append('type', this.artworkForm.type!); // Assicura che il tipo non sia undefined

        this.selectedFiles.forEach((file, index) => {
            formData.append('photo', file, file.name);  // Allegare l'immagine
        });

        this.artworkService.createArtwork(formData).subscribe(
            (newArtwork: Artwork) => {
                this.artworks.push(newArtwork);
                this.message = 'Opera creata con successo';
                this.success = true;
                this.resetForm();
                this.loading = false;
            },
            (error) => {
                this.message = 'Errore nella creazione dell\'opera';
                console.error('Errore durante la creazione dell\'opera:', error);
                this.success = false;
                this.loading = false;
            }
        );
    } else {
        this.message = 'Per favore compila tutti i campi e carica almeno un\'immagine';
        this.success = false;
    }
}


  // Modifica un'opera esistente
  editArtwork(artwork: Artwork): void {
    this.artworkForm = { title: artwork.title, description: artwork.description, price: artwork.price, categoryId: artwork.categoryId, type: artwork.type };
    this.selectedArtworkId = artwork.id;
    this.editing = true;
  }

  // Salva le modifiche a un'opera
  updateArtwork(): void {
    if (this.selectedArtworkId && this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId) {
      this.loading = true;

      const formData = new FormData();
      formData.append('title', this.artworkForm.title!);
      formData.append('description', this.artworkForm.description!);
      formData.append('price', this.artworkForm.price!.toString());
      formData.append('categoryId', this.artworkForm.categoryId!.toString());
      formData.append('type', this.artworkForm.type!);

      this.selectedFiles.forEach((file, index) => {
        formData.append('photo', file, file.name);
      });

      this.artworkService.updateArtwork(this.selectedArtworkId, formData).pipe(
        tap((updatedArtwork: Artwork) => {
          const index = this.artworks.findIndex(art => art.id === this.selectedArtworkId);
          if (index !== -1) {
            this.artworks[index] = updatedArtwork;
          }
          this.message = 'Opera aggiornata con successo';
          this.success = true;
          this.resetForm();
        }),
        catchError(error => {
          this.message = 'Errore durante l\'aggiornamento dell\'opera';
          this.success = false;
          return of(null);
        })
      ).subscribe().add(() => this.loading = false);
    }
  }

  // Elimina un'opera
  deleteArtwork(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa opera?')) {
      this.loading = true;
      this.artworkService.deleteArtwork(id).pipe(
        tap(() => {
          this.artworks = this.artworks.filter(art => art.id !== id);
          this.message = 'Opera eliminata con successo';
          this.success = true;
        }),
        catchError(error => {
          this.message = 'Errore durante l\'eliminazione dell\'opera';
          this.success = false;
          return of(null);
        })
      ).subscribe().add(() => this.loading = false);
    }
  }

  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined, type: ArtworkType.Opere };
    this.selectedFiles = [];
    this.selectedArtworkId = null;
    this.editing = false;
    this.message = '';
  }
}
