import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { CategoryService } from '../../services/category.service';
import { Artwork } from '../../Models/artwork';
import { Category } from '../../Models/category';
import { catchError, of, Subject } from 'rxjs'; // Usa RxJS

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
  categoryId: number | null = null;
  private reloadArtworks$ = new Subject<void>(); // RxJS Subject per gestire il ricaricamento delle opere

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  gOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];  // Ottieni il categoryId dalla route
      if (this.categoryId) {
        this.artworkForm.categoryId = this.categoryId;  // Precompila il form con il categoryId
        this.loadArtworks(this.categoryId);  // Carica le opere per la categoria corrente
      }
    });

    this.loadCategories();  // Carica le categorie disponibili (se necessario)
  }

  loadArtworks(categoryId: number): void {
    this.artworkService.getArtworksByCategory(categoryId).subscribe(
      (data: Artwork[]) => {
        this.artworks = data;
      },
      (error) => {
        this.message = 'Errore nel caricamento delle opere';
        console.error('Errore durante il caricamento delle opere:', error);
        this.success = false;
      }
    );
  }


   // Aggiungi una nuova opera
   createArtwork(): void {
    if (this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId) {
      this.loading = true;
      this.artworkService.createArtwork(this.artworkForm).subscribe(
        (newArtwork) => {
          this.message = 'Opera creata con successo';
          this.success = true;
          this.artworks.push(newArtwork);  // Aggiungi la nuova opera all'elenco
          this.resetForm();
        },
        (error) => {
          this.message = 'Errore nella creazione dell\'opera';
          this.success = false;
        }
      ).add(() => this.loading = false);
    }
  }

  // Resetta il form
  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: this.categoryId };  // Mantieni il categoryId precompilato
    this.selectedArtworkId = null;
    this.editing = false;
    this.message = '';
  }

  // Modifica un'opera esistente
  editArtwork(artwork: Artwork): void {
    this.artworkForm = { ...artwork };
    this.selectedArtworkId = artwork.id;
    this.editing = true;
  }

  // Salva le modifiche all'opera
  updateArtwork(): void {
    if (this.selectedArtworkId && this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId) {
      this.loading = true;
      this.artworkService.updateArtwork(this.selectedArtworkId, this.artworkForm).subscribe(
        () => {
          this.message = 'Opera aggiornata con successo';
          this.success = true;
          this.reloadArtworks$.next(); // Emetti il valore per ricaricare la lista delle opere
          this.resetForm();
        },
        () => {
          this.message = 'Errore nell\'aggiornamento dell\'opera';
          this.success = false;
        }
      ).add(() => this.loading = false);
    }
  }

  // Elimina un'opera
  deleteArtwork(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa opera?')) {
      this.loading = true;
      this.artworkService.deleteArtwork(id).subscribe(
        () => {
          this.message = 'Opera eliminata con successo';
          this.success = true;
          this.reloadArtworks$.next(); // Emetti il valore per ricaricare la lista delle opere
        },
        () => {
          this.message = 'Errore nell\'eliminazione dell\'opera';
          this.success = false;
        }
      ).add(() => this.loading = false);
    }
  }

  // Carica tutte le categorie per il dropdown
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
}
