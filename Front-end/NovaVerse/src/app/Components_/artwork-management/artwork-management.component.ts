import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Artwork, ArtworkType } from '../../Models/artwork';
import { Category } from '../../Models/category';
import { ArtworkService } from '../../services/artwork.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-artwork-management',
  templateUrl: './artwork-management.component.html',
  styleUrls: ['./artwork-management.component.scss']
})
export class ArtworkManagementComponent implements OnInit {
  artworks$: Observable<Artwork[]> = new Observable<Artwork[]>();
  categoryId: number | null | undefined;
  categories: Category[] = [];
  artworkForm: Partial<Artwork> = { title: '', description: '', price: 0, categoryId: undefined, type: ArtworkType.Opere, imageUrl: '' };
  editing: boolean = false;
  loading: boolean = false;
  message: string = '';
  success: boolean = true;
  selectedArtworkId: number | null = null;
  selectedFile: File | null = null;
  isArtist: boolean = false;
  artworkTypes = Object.values(ArtworkType);

  constructor(
    private artworkService: ArtworkService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'] ? +params['id'] : null;
      if (this.categoryId) {
        this.artworkForm.categoryId = this.categoryId;
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Errore nel caricamento delle categorie');
      }
    );
  }

  createArtwork(): void {
    if (this.loading) return;

    this.loading = true;
    const formData = new FormData();

    if (this.artworkForm.title) {
      formData.append('title', this.artworkForm.title);
    }
    if (this.artworkForm.description) {
      formData.append('description', this.artworkForm.description);
    }
    if (this.artworkForm.price !== undefined) {
      formData.append('price', (this.artworkForm.price).toString());
    }
    if (this.artworkForm.categoryId !== undefined) {
      formData.append('categoryId', this.artworkForm.categoryId.toString());
    }
    const selectedCategory = this.categories.find(category => category.id === this.artworkForm.categoryId);
    if (selectedCategory) {
      formData.append('categoryName', selectedCategory.name);  // Aggiungi il nome della categoria
    }
    if (this.artworkForm.type) {
      formData.append('type', this.artworkForm.type);
    }

    // Se c'è un file selezionato, aggiungilo
    if (this.selectedFile) {
      formData.append('photoFile', this.selectedFile, this.selectedFile.name);
    }

    // Se c'è un URL dell'immagine, aggiungilo
    if (this.artworkForm.imageUrl) {
      formData.append('imageUrl', this.artworkForm.imageUrl);
    }

    // Aggiungi il nome dell'artista
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.username) {
      formData.append('artistName', currentUser.username);
    } else {
      console.error('Nome dell\'artista non trovato.');
      this.loading = false;
      return;
    }

    this.artworkService.createArtwork(formData).subscribe(
      () => {
        this.loading = false;
        alert('Opera creata con successo!');  // Popup di conferma
        console.log('Opera creata con successo');
        this.resetForm();
      },
      (error) => {
        this.loading = false;
        console.error('Errore durante la creazione dell\'opera', error);
      }
    );
  }


  // Metodo per verificare se l'utente è l'artista dell'opera
  checkIfArtist(): void {
    const currentUser = this.authService.getCurrentUser();
    // Supponiamo che tu abbia un metodo per ottenere l'opera attuale
    const artworkId = this.route.snapshot.params['artworkId'];
    if (artworkId) {
      this.artworkService.getArtworkById(artworkId).subscribe((artwork) => {
        if (currentUser && currentUser.id === artwork.artistId) {
          this.isArtist = true;  // L'utente è l'artista
        }
      });
    }
  }

  goBackToArtworkList(): void {
    const categoryId = this.route.snapshot.paramMap.get('id'); // Ottieni l'ID della categoria dall'URL
    this.router.navigate([`/categories/${categoryId}/artworks`]);
  }

  resetForm(): void {
    this.artworkForm = { title: '', description: '', price: 0, categoryId: undefined, type: ArtworkType.Opere, imageUrl: '' };
    this.selectedFile = null;
  }
}
