import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { AuthService } from '../../services/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { Artwork } from '../../Models/artwork';
import { switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { CommentService } from '../../services/comment-service.service';
import { CartItem } from '../../Models/cart';

@Component({
  selector: 'app-artwork-detail',
  templateUrl: './artwork-detail.component.html',
  styleUrls: ['./artwork-detail.component.scss']
})
export class ArtworkDetailComponent implements OnInit {
  artwork$: Observable<Artwork | null> | null = null;
  artist: any = null;
  category: any = null;
  comments: any[] = [];
  newComment: string = '';
  loading: boolean = true;
  artistName: string = '';
  editMode = false;
  artworkData: Partial<Artwork> = {}; // Contiene i dati modificabili dell'opera
  selectedImage: File | null = null;
  selectedArtwork: Artwork | null = null;

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private shoppingCartService: ShoppingCartService,
    private commentService: CommentService,
    private router: Router,           // Aggiungi Router qui
  ) {}

  ngOnInit(): void {
    // Carica i dettagli dell'opera
    this.artwork$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = +params.get('id')!;
        return this.artworkService.getArtworkById(id);
      })
    );
    this.artwork$.subscribe(artwork => {
      if (artwork) {
        this.artworkData = { ...artwork };
        this.loadComments(artwork.id); // Carica i commenti associati all'opera
      }
    });
  }

  // Gestione della modalità di modifica
  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  // Caricamento dell'immagine selezionata
  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  // Carica i commenti associati all'opera d'arte
  loadComments(artworkId: number): void {
    this.commentService.getCommentsByArtwork(artworkId).subscribe(
      (comments) => this.comments = comments,
      (error) => console.error('Errore nel caricamento dei commenti:', error)
    );
  }

  // Verifica se l'utente è l'artista dell'opera
  isArtist(artwork: Artwork): boolean {
    const user = this.authService.getCurrentUser();
    return !!user && artwork.artistId === user.id;
  }

  // Aggiungi l'opera ai preferiti
  addToFavorites(artwork: Artwork): void {
    this.favoriteService.addFavorite(artwork.id).subscribe(
      () => console.log('Opera aggiunta ai preferiti'),
      (error) => console.error('Errore nell\'aggiunta ai preferiti', error)
    );
  }

  // Salva le modifiche all'opera
  saveChanges(artwork: Artwork): void {
    const formData = new FormData();
    formData.append('title', this.artworkData.title || '');
    formData.append('description', this.artworkData.description || '');
    formData.append('price', this.artworkData.price?.toString() || '0');
    formData.append('categoryId', this.artworkData.categoryId?.toString() || '');
    formData.append('artistName', this.artworkData.artistName || '');
    formData.append('artistId', this.artworkData.artistId?.toString() || '');

    // Se c'è un'immagine selezionata, la aggiungiamo al form
    if (this.selectedImage) {
        formData.append('photoFile', this.selectedImage);
    }

    this.artworkService.updateArtwork(artwork.id, formData)
        .subscribe(
            () => {
                this.toggleEdit(); // Disattiva la modalità di modifica
                console.log('Opera aggiornata con successo');
            },
            error => {
                console.error('Errore durante l\'aggiornamento dell\'opera:', error);
            }
        );
  }


  // Elimina l'opera
  deleteArtwork(artworkId: number): void {
    this.artworkService.deleteArtwork(artworkId).subscribe(
      () => {
        console.log('Opera eliminata');
      },
      error => console.error('Errore durante l\'eliminazione dell\'opera', error)
    );
  }

  // Segna l'opera come venduta/non venduta
  markAsSoldOut(artwork: Artwork): void {
    const updatedArtwork = { soldOut: !artwork.soldOut };
    const artworkData = new FormData();
    artworkData.append('soldOut', String(updatedArtwork.soldOut));

    this.artworkService.updateArtwork(artwork.id, artworkData).subscribe(
      () => {
        artwork.soldOut = !artwork.soldOut;
        console.log('Stato venduto aggiornato');
      },
      (error) => console.error('Errore durante l\'aggiornamento dello stato venduto', error)
    );
  }

  // Lascia una recensione per l'opera
  leaveReview(content: string): void {
    if (this.artwork$) {
      this.artwork$.subscribe((artwork) => {
        if (artwork && artwork.id) {
          const userId = this.getCurrentUserId();

          const commentDto = {
            artworkId: artwork.id,
            userId: userId,
            commentText: content,
            createDate: new Date()
          };

          this.commentService.addComment(commentDto).subscribe(
            () => {
              this.comments.push({ commentText: content, user: { username: 'Tu' } });
              this.newComment = '';
              console.log('Recensione inviata con successo');
            },
            (error) => console.error('Errore nell\'invio della recensione', error)
          );
        } else {
          console.error('Errore: L\'artwork non è caricato correttamente.');
        }
      });
    }
  }

  // Metodo per aggiungere l'opera al carrello
  addToCart(artwork: Artwork | null): void {
    if (!artwork) {
      console.error('Opera non valida');
      return;
    }

    const cartItem: CartItem = {
      id: 0, // L'id sarà generato dal backend
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      priceAtAddTime: artwork.price,
      quantity: 1,
      totalPrice: artwork.price,
      artistName: ''
    };

    this.shoppingCartService.addItemToCart(cartItem).subscribe(
      () => {
        console.log('Opera aggiunta al carrello');
      },
      (error) => {
        console.error('Errore durante l\'aggiunta dell\'opera al carrello:', error);
      }
    );
  }

  // Funzione per tornare alla categoria
  goBackToCategory(): void {
    // Usa l'osservabile artwork$ per ottenere l'ID della categoria
    this.artwork$?.subscribe(artwork => {
      if (artwork) {
        const categoryId = artwork.categoryId;  // Ottieni l'ID della categoria dall'opera d'arte
        this.router.navigate(['/categories', categoryId, 'artworks']);  // Naviga alla lista delle opere d'arte per quella categoria
      }
    });
  }

  // Metodo per ottenere l'ID dell'utente corrente
  getCurrentUserId(): number {
    const user = this.authService.getCurrentUser();
    return user ? user.id : 0;
  }
}
