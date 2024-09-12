import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork, ArtworkType } from '../../Models/artwork'; // Assicurati di importare ArtworkType
import { catchError, Observable, of, tap } from 'rxjs';
import { Category } from '../../Models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-artwork-management',
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.scss']
})
export class ArtworkManagementComponent implements OnInit {
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

  // Aggiungi la proprietà ArtworkType per poterla usare nel template
  ArtworkType = ArtworkType;

  constructor(
    private artworkService: ArtworkService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'] ? +params['id'] : null; // Assicurati che sia null se non esiste
      if (this.categoryId) {
        this.artworkForm.categoryId = this.categoryId; // Imposta solo se esiste
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.artworks$ = this.artworkService.getArtworksByCategory(this.categoryId);
      }
    });
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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();

      reader.onload = () => {
        // Se devi convertire il file in base64 e visualizzarlo
        this.artworkForm.imageUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
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

    // Assicurati che il file sia presente
    if (this.selectedFile) {
      formData.append('photoFile', this.selectedFile);
      formData.append('Photo', this.artworkForm.imageUrl ?? '');
    }
    else {
      console.error('Il file immagine è obbligatorio');
      this.message = 'Seleziona un file immagine per continuare';
      return; // Blocca l'esecuzione se il file immagine non è selezionato
    }

    // Debug: log del FormData per verificare che tutto sia corretto
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    // Invia la richiesta
    this.artworkService.createArtwork(formData).subscribe(
      (response) => {
        console.log('Opera creata con successo', response);
        this.message = 'Opera creata con successo';
        this.success = true;
        this.resetForm();
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

      this.artworkService.updateArtwork(this.selectedArtworkId, formData).subscribe(
        () => {
          this.message = 'Opera aggiornata con successo';
          this.success = true;
          this.resetForm();
          this.loadArtworks();
          this.loading = false;
        },
        (error) => {
          this.message = 'Errore durante l\'aggiornamento dell\'opera';
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
          this.loadArtworks();
          this.loading = false;
        },
        (error) => {
          this.message = 'Errore durante l\'eliminazione dell\'opera';
          this.success = false;
          this.loading = false;
        }
      );
    }
  }

  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined, imageUrl: '' };
    this.selectedFile = null;
    this.selectedArtworkId = null;
    this.editing = false;
    this.message = '';
  }
}
