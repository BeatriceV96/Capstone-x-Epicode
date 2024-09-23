import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { AuthService } from '../../services/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { Artwork } from '../../Models/artwork';
import { switchMap, filter, tap, catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { CommentService } from '../../services/comment-service.service';
import { CartItem } from '../../Models/cart';
import { Favorite } from '../../Models/favorite';
import { CommentDto } from '../../Models/CommentDto';
import { Category } from '../../Models/category';
import { iUser } from '../../Models/i-user';

@Component({
  selector: 'app-artwork-detail',
  templateUrl: './artwork-detail.component.html',
  styleUrls: ['./artwork-detail.component.scss']
})
export class ArtworkDetailComponent implements OnInit {
  artwork$: Observable<Artwork | null> | null = null;
  comments$: Observable<CommentDto[]> = of([]);
  currentArtwork: Artwork | null = null;
  artist: any = null;
  category: any = null;
  comments: any[] = [];
  newComment: string = '';
  loading: boolean = true;
  artistName: string = '';
  editMode = false;
  artworkData: Partial<Artwork> = {};
  selectedImage: File | null = null;
  selectedArtwork: Artwork | null = null;
  showPopup = false;
  editingCommentId: number | null = null;  // Per tracciare il commento che si sta modificando
  editedCommentText: string = '';  // Contiene il testo modificato del commento
  deletingCommentId: number | null = null;
  showConfirmDelete = false;  // Per mostrare o nascondere il modale di conferma
  artworkToDelete: number | null = null;  // ID dell'opera da eliminare
  showDeleteSuccess = false;
  categories: Category[] = [];
  categoryName: string = '';  // Per visualizzare il nome della categoria
  createDate: Date | null = null;
  isAuthor: boolean = false;  // Variabile per controllare se l'utente è l'autore

  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private shoppingCartService: ShoppingCartService,
    private commentService: CommentService,
    private router: Router,           // Aggiungi Router qui
  ) {}


  ngOnInit(): void {
    // Recupera l'utente corrente
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      console.log('ID utente corrente:', currentUser.id);  // Log dell'ID utente
    } else {
      console.error('Utente non autenticato o ID non disponibile');
    }

    // Carica i dettagli dell'opera
    this.artwork$ = this.route.paramMap.pipe(
      switchMap(params => {
        const artworkId = Number(params.get('id'));
        console.log('Artwork ID recuperato dalla URL:', artworkId);  // Log dell'ID dell'opera
        return this.artworkService.getArtworkById(artworkId);
      }),
      tap(artwork => {
        if (artwork) {
          this.currentArtwork = artwork;
          console.log('Opera ricevuta:', artwork);

          // Carica i commenti dell'opera
          this.loadComments(artwork.id);

          if (artwork.artistId !== 0) {
            console.log('Caricamento dettagli artista con ID:', artwork.artistId);
            this.loadArtistDetails(artwork.artistId);  // Carica i dettagli dell'artista
          } else {
            console.error('ID dell\'artista non valido: ', artwork.artistId);
          }

          // Verifica se l'utente corrente è l'autore dell'opera
          if (currentUser && artwork.artistId === currentUser.id) {
            console.log('L\'utente corrente è l\'autore dell\'opera.');
            this.isAuthor = true;  // Imposta un flag per l'autore
          } else {
            console.log('L\'utente corrente non è l\'autore dell\'opera.');
            this.isAuthor = false;  // Non è l'autore
          }
        }
      }),
      catchError(error => {
        console.error('Errore durante il caricamento dell\'opera:', error);
        return of(null);  // Ritorna un observable vuoto in caso di errore
      }),
      shareReplay(1)  // Condividi lo stesso observable con più subscriber
    );
  }

  // Metodo per caricare i dettagli dell'artista
  loadArtistDetails(artistId: number): void {
    if (artistId === 0) {
      console.error('L\'ID dell\'artista è 0, impossibile caricare i dettagli.');
      return;
    }

    console.log('Caricamento dettagli per l\'artista con ID:', artistId);
  }


  // Verifica se l'utente è l'artista dell'opera
  isArtist(artwork: Artwork): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && artwork.artistId === user.id);  // Utilizza !! per assicurarti che sia un booleano
  }



// Metodo per caricare il nome e la data di creazione della categoria
loadCategoryDetails(categoryId: number): void {
  this.categoryService.getCategoryById(categoryId).subscribe(
    (category: Category) => {
      this.categoryName = category.name;  // Imposta il nome della categoria
      this.createDate = new Date();  // Manteniamo la data impostata manualmente come hai richiesto
    },
    (error) => {
      console.error('Errore nel caricamento della categoria:', error);
    }
  );
}

  // Gestione della modalità di modifica
 toggleEdit(): void {
  this.editMode = !this.editMode;

  if (this.editMode && this.currentArtwork) {
    // Popola il form con i dati attuali dell'opera
    this.artworkData = {
      title: this.currentArtwork.title,
      description: this.currentArtwork.description,
      price: this.currentArtwork.price,
      categoryId: this.currentArtwork.categoryId,
      categoryName: this.currentArtwork.categoryName,  // Popola con il nome della categoria
      artistName: this.currentArtwork.artistName,
      artistId: this.currentArtwork.artistId,
    };

    // Carica tutte le categorie per la tendina
    this.categoryService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;  // Popola l'elenco delle categorie
        console.log('Categorie caricate:', categories);
      },
      (error) => {
        console.error('Errore nel caricamento delle categorie:', error);
      }
    );
  }
}


  // Caricamento dell'immagine selezionata
  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }
  // Aggiungi l'opera ai preferiti
  addToFavorites(artworkId: number): void {
    const favorite: Favorite = { artworkId: artworkId, artistId: null, id: 0, userId: 0, createDate: new Date() };
    this.favoriteService.addFavorite(favorite).subscribe(() => {
      this.showPopup = true;
      setTimeout(() => this.showPopup = false, 3000);  // Popup for 3 seconds
    });
  }

  // Salva le modifiche all'opera
// Salva le modifiche all'opera
  // Salva le modifiche all'opera
saveChanges(artwork: Artwork): void {
  if (!this.currentArtwork) {
    console.error('Opera non caricata correttamente.');
    return;
  }

  const formData = new FormData();
  formData.append('title', this.artworkData.title || '');
  formData.append('description', this.artworkData.description || '');
  formData.append('price', this.artworkData.price?.toString() || '0');
  formData.append('categoryId', this.artworkData.categoryId?.toString() || '');
  formData.append('categoryName', this.artworkData.categoryName || '');
  formData.append('artistName', this.artworkData.artistName || '');
  formData.append('artistId', this.artworkData.artistId?.toString() || '');

  if (this.selectedImage) {
    formData.append('photoFile', this.selectedImage);
  }

  this.artworkService.updateArtwork(this.currentArtwork.id, formData)
    .subscribe(
      (updatedArtwork) => {
        this.currentArtwork = updatedArtwork;  // Aggiorna il modello corrente con i dati modificati
        this.artworkData = { ...updatedArtwork };  // Aggiorna anche il form con i nuovi dati
        this.toggleEdit(); // Disattiva la modalità di modifica
        console.log('Opera aggiornata con successo');

        // Mostra un alert per confermare che l'opera è stata aggiornata
        alert('Opera aggiornata con successo!');
      },
      error => {
        console.error('Errore durante l\'aggiornamento dell\'opera:', error);
      }
    );
}


  // Apre la finestra di conferma per l'eliminazione
  deleteArtwork(artworkId: number): void {
    // Naviga immediatamente alla lista delle opere della categoria
    this.router.navigate(['/categories', this.currentArtwork?.categoryId, 'artworks']);

    // Effettua la richiesta di eliminazione
    this.artworkService.deleteArtwork(artworkId).subscribe(
      () => {
        // Puoi anche loggare un messaggio se necessario per confermare il successo dell'eliminazione
        console.log('Opera eliminata con successo');
      },
      (error) => {
        console.error('Errore durante l\'eliminazione dell\'opera:', error);
      }
    );
  }


  prepareDeleteArtwork(artworkId: number | null): void {
    if (artworkId !== null) {
      this.artworkToDelete = artworkId;
      this.showConfirmDelete = true;  // Mostra il popup di conferma
    }
  }

// Conferma l'eliminazione dell'opera
confirmDeleteArtwork(): void {
  if (this.artworkToDelete !== null) {
    this.artworkService.deleteArtwork(this.artworkToDelete).subscribe(
      () => {
        this.showConfirmDelete = false;  // Chiudi il modale di conferma
        this.showDeleteSuccess = true;   // Mostra la notifica di successo

        // Nascondi la notifica dopo 3 secondi
        setTimeout(() => {
          this.showDeleteSuccess = false;

          // Reindirizza alla lista delle opere della categoria
          this.router.navigate(['/categories', this.currentArtwork?.categoryId, 'artworks']);
        }, 3000); // Durata della notifica 3 secondi

        // Resetta l'ID dell'opera da eliminare
        this.artworkToDelete = null;
      },
      (error) => {
        console.error('Errore durante l\'eliminazione dell\'opera', error);
        this.showConfirmDelete = false;  // Chiudi il modale in caso di errore
      }
    );
  }
}


  cancelDelete(): void {
    this.showConfirmDelete = false;  // Chiudi il popup di conferma
    this.artworkToDelete = null;  // Resetta l'ID dell'opera
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

  // Carica i commenti associati all'opera d'arte
  loadComments(artworkId: number): void {
    this.comments$ = this.commentService.getCommentsByArtwork(artworkId).pipe(
      tap((comments) => {
        console.log('Commenti caricati:', comments);
      }),
      catchError(error => {
        console.error('Errore nel caricamento dei commenti:', error);
        return of([]);  // Ritorna un array vuoto in caso di errore
      })
    );
  }

// Aggiunge una recensione
leaveReview(content: string): void {
  // Verifica che `currentArtwork` sia stato caricato correttamente
  if (!this.currentArtwork) {
    console.error('Opera non caricata correttamente.');
    return;
  }

  const user = this.authService.getCurrentUser();  // Recupera l'utente corrente

  if (user) {
    const commentDto: CommentDto = {
      artworkId: this.currentArtwork.id,  // Usa `currentArtwork` che ora è sicuramente definito
      userId: user.id,
      profilePicture: user.profilePicture ? this.getProfilePictureUrl(user.profilePicture) : undefined, // Usa `undefined` invece di `null`
      username: user.username,
      commentText: content,
      createDate: new Date()
    };

    // Aggiungi il nuovo commento
    this.commentService.addComment(commentDto).subscribe(
      () => {
        // Ricarica i commenti dal backend per assicurarsi che il nuovo commento sia incluso e non venga duplicato
        this.loadComments(this.currentArtwork!.id);
        this.newComment = '';  // Svuota il campo di testo
      },
      (error) => console.error('Errore nell\'invio della recensione', error)
    );
  } else {
    console.error('Utente non autenticato');
  }
}

// Controlla se l'utente corrente è l'autore del commento
isCurrentUser(userId: number): boolean {
  const user = this.authService.getCurrentUser();
  return user ? user.id === userId : false;
}

// Abilita la modalità di modifica per un commento
enableEditComment(comment: CommentDto): void {
  this.editingCommentId = comment.id!;
  this.editedCommentText = comment.commentText;  // Precompila il testo attuale
}

// Annulla la modifica del commento
cancelEdit(): void {
  this.editingCommentId = null;  // Resetta l'ID del commento in modifica
  this.editedCommentText = '';  // Svuota il campo di testo
}

// Salva il commento modificato
saveEditedComment(commentId: number | undefined): void {
  if (commentId === undefined) {
    console.error('Comment ID is undefined');
    return;
  }

  const updatedComment: CommentDto = {
    id: commentId,
    artworkId: this.currentArtwork?.id || 0,
    userId: this.authService.getCurrentUser()?.id || 0,
    commentText: this.editedCommentText,
    username: this.authService.getCurrentUser()?.username || '',
    profilePicture: this.authService.getCurrentUser()?.profilePicture || ''
  };

  this.commentService.updateComment(commentId, updatedComment).subscribe(
    (response) => {
      console.log('Comment updated successfully:', response);
      this.editingCommentId = null; // Clear edit mode
      this.loadComments(this.currentArtwork?.id || 0); // Reload comments
    },
    (error) => {
      console.error('Error updating comment:', error);
    }
  );
}


deleteComment(commentId: number): void {
  // Imposta l'ID del commento che sta per essere eliminato (per visualizzare lo spinner)
  this.deletingCommentId = commentId;

  // Chiama il servizio per eliminare il commento
  this.commentService.deleteComment(commentId).subscribe(
    () => {
      // Elimina il commento dalla lista locale immediatamente
      this.comments$ = this.comments$.pipe(
        map(comments => comments.filter(comment => comment.id !== commentId))
      );

      // Rimuovi l'ID del commento in fase di eliminazione (per nascondere lo spinner)
      this.deletingCommentId = null;

      // Log per confermare l'eliminazione
      console.log('Commento eliminato con successo');
    },
    (error) => {
      console.error('Errore durante l\'eliminazione del commento:', error);
      // Rimuovi l'ID del commento in caso di errore per nascondere lo spinner
      this.deletingCommentId = null;
    }
  );
}





getProfilePictureUrl(profilePicturePath: string | null): string {
  if (!profilePicturePath) {
    return 'http://localhost:5034/uploads/default-profile.png';  // Immagine di default
  }

  if (profilePicturePath.startsWith('/uploads')) {
    return 'http://localhost:5034' + profilePicturePath;
  }

  return 'http://localhost:5034/uploads/' + profilePicturePath;
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
        alert('Opera aggiunta al carrello con successo!');  // Popup di conferma
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
