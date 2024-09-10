import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { CategoryService } from '../../services/category.service';
import { Artwork } from '../../Models/artwork';
import { Category } from '../../Models/category';
import { ActivatedRoute, Router } from '@angular/router';  // Per il reindirizzamento

@Component({
  selector: 'app-artwork-management',
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.scss']
})
export class ArtworkManagementComponent implements OnInit {
  artworks: Artwork[] = [];
  categories: Category[] = [];  // Definiamo le categorie qui
  artworkForm: Partial<Artwork> = { title: '', description: '', price: 0, categoryId: undefined };  // Usa undefined invece di null
  selectedArtworkId: number | null = null;
  categoryId: number | null = null; // Aggiungi la proprietà per l'ID della categoria
  editing: boolean = false;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,  // Aggiungi CategoryService per caricare le categorie
    private route: ActivatedRoute,  // Attivare la rotta per ottenere i parametri
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ottieni l'ID della categoria dalla rotta
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];  // Converte l'ID in numero
      if (this.categoryId) {
        this.loadArtworks(this.categoryId);  // Carica le opere in base all'ID della categoria
      }
    });

    // Carica tutte le categorie disponibili per la tendina
    this.loadCategories();
  }

  // Carica tutte le categorie per il dropdown
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Errore nel caricamento delle categorie:', error);
      }
    );
  }

  // Carica tutte le opere d'arte in base alla categoria
  loadArtworks(categoryId: number): void {
    this.artworkService.getArtworksByCategory(categoryId).subscribe(
      (data: Artwork[]) => {
        this.artworks = data;
      },
      (error) => {
        this.message = 'Errore nel caricamento delle opere';
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

          // Aggiungi l'opera creata alla lista locale
          this.artworks.push(newArtwork);

          this.resetForm();
        },
        (error) => {
          this.message = 'Errore nella creazione dell\'opera';
          this.success = false;
        }
      ).add(() => this.loading = false);
    }
  }

  // Modifica un'opera esistente
  editArtwork(artwork: Artwork): void {
    this.artworkForm = { title: artwork.title, description: artwork.description, price: artwork.price, categoryId: artwork.categoryId };
    this.selectedArtworkId = artwork.id;
    this.editing = true;
  }

  // Salva le modifiche all'opera
  updateArtwork(): void {
    if (this.selectedArtworkId && this.artworkForm.title && this.artworkForm.description && this.artworkForm.categoryId) {
      this.loading = true;
      this.artworkService.updateArtwork(this.selectedArtworkId, this.artworkForm).subscribe(
        (updatedArtwork) => {
          this.message = 'Opera aggiornata con successo';
          this.success = true;

          // Trova l'opera modificata nella lista e aggiorna i suoi dati
          const index = this.artworks.findIndex(art => art.id === this.selectedArtworkId);
          if (index !== -1) {
            this.artworks[index] = updatedArtwork;
          }

          this.resetForm();
        },
        (error) => {
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

          // Rimuovi l'opera eliminata dalla lista locale
          this.artworks = this.artworks.filter(art => art.id !== id);
        },
        (error) => {
          this.message = 'Errore nell\'eliminazione dell\'opera';
          this.success = false;
        }
      ).add(() => this.loading = false);
    }
  }

  // Resetta il form
  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined };
    this.selectedArtworkId = null;
    this.editing = false;
    this.message = '';
  }
}
