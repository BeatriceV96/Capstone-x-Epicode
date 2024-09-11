import { DomSanitizer } from '@angular/platform-browser';
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
    type: ArtworkType.Opere,
    imageUrl: '' // Campo per URL o base64
  };
  selectedFile: File | null = null; // Campo per il file selezionato
  editing: boolean = false;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;
  selectedArtworkId: number | null = null;
  selectedFilePreviewUrl: string | ArrayBuffer | null = null;


  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
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

  // Gestione del file immagine selezionato
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Creiamo un URL di anteprima per il file selezionato
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreviewUrl = reader.result; // Memorizziamo l'URL di anteprima
      };
      reader.readAsDataURL(file); // Leggiamo il file come Data URL (base64)
    }
  }


  // Funzione per convertire un array di byte in una stringa Base64
photoBase64(photo: Uint8Array): string {
  return 'data:image/jpeg;base64,' + this.arrayBufferToBase64(photo);
}

// Helper per convertire ArrayBuffer in Base64
private arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

  // Crea una nuova opera
  createArtwork(): void {
    if (this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId) {
      this.loading = true;

      const formData = new FormData();
      formData.append('title', this.artworkForm.title!);
      formData.append('description', this.artworkForm.description!);
      formData.append('price', this.artworkForm.price!.toString());
      formData.append('categoryId', this.artworkForm.categoryId!.toString());
      formData.append('type', this.artworkForm.type!);

      // Aggiungi l'immagine, o come file o come URL
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile); // Se è stato caricato un file
      } else if (this.artworkForm.imageUrl) {
        formData.append('imageUrl', this.artworkForm.imageUrl); // Se viene fornito un URL
      }

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
    this.artworkForm = {
      title: artwork.title,
      description: artwork.description,
      price: artwork.price,
      categoryId: artwork.categoryId,
      type: artwork.type,
      imageUrl: artwork.imageUrl // Imposta l'URL dell'immagine esistente
    };
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

      // Aggiungi l'immagine, o come file o come URL
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile); // Se è stato caricato un file
      } else if (this.artworkForm.imageUrl) {
        formData.append('imageUrl', this.artworkForm.imageUrl); // Se viene fornito un URL
      }

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

  // Funzione per resettare il form
  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined, type: ArtworkType.Opere, imageUrl: '' };
    this.selectedFile = null;
    this.selectedArtworkId = null;
    this.editing = false;
    this.message = '';
  }
}
