import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { AuthService } from '../../services/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { Artwork } from '../../Models/artwork';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { CommentService } from '../../services/comment.service.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-artwork-detail',
  templateUrl: './artwork-detail.component.html',
  styleUrls: ['./artwork-detail.component.scss']
})
export class ArtworkDetailComponent implements OnInit {
  artwork: Artwork | null = null;  // Rimuovi async pipe dal template
  artwork$: Observable<Artwork | null> | null = null;
  artist: any = null;
  category: any = null;
  comments: any[] = [];
  newComment: string = '';
  editing: boolean = false;
  editedArtwork: Partial<Artwork> = {};
  loading: boolean = true;
  artworkSubscription: Subscription | null = null;
  saveLoading: boolean = false;


  constructor(
    private artworkService: ArtworkService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private shoppingCartService: ShoppingCartService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.artwork$ = this.route.paramMap.pipe(
      switchMap(params => {
        const artworkId = Number(params.get('id'));
        return this.artworkService.getArtworkById(artworkId);
      }),
      filter(artwork => !!artwork)
    );

    this.artwork$.subscribe(artwork => {
      this.artwork = artwork;
      this.loading = false;
      if (artwork) {
        this.loadComments(artwork.id);
        this.loadArtist(artwork.artistId);
      }
    });
  }

  loadArtwork(): void {
    this.artworkSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const artworkId = Number(params.get('id'));
        return this.artworkService.getArtworkById(artworkId).pipe(
          tap(artwork => {
            this.artwork = artwork;
            this.loadComments(artwork.id);
            this.loadArtist(artwork.artistId);
          }),
          catchError(error => {
            console.error('Errore nel caricamento dell\'opera:', error);
            this.loading = false;
            return of(null);  // In caso di errore
          })
        );
      })
    ).subscribe();
  }

  loadComments(artworkId: number): void {
    this.commentService.getCommentsByArtwork(artworkId).subscribe(
      (comments) => this.comments = comments,
      (error) => console.error('Errore nel caricamento dei commenti:', error)
    );
  }

  loadArtist(artistId: number): void {
    this.authService.getUserById(artistId).subscribe(
      (artist) => this.artist = artist,
      (error) => console.error('Errore nel caricamento delle informazioni dell\'artista:', error)
    );
  }

  isArtist(artwork: Artwork): boolean {
    const user = this.authService.getCurrentUser();
    return !!user && artwork.artistId === user.id;
  }

  addToFavorites(artwork: Artwork): void {
    this.favoriteService.addFavorite(artwork.id).subscribe(
      () => console.log('Opera aggiunta ai preferiti'),
      error => console.error('Errore nell\'aggiunta ai preferiti', error)
    );
  }

  addToCart(artwork: Artwork): void {
    this.shoppingCartService.addItemToCart(artwork.id).subscribe(
      () => console.log('Opera aggiunta al carrello'),
      (error) => console.error('Errore nell\'aggiunta al carrello', error)
    );
  }

  editArtwork(): void {
    this.editing = true;
    this.editedArtwork = { ...this.artwork };  // Clona l'opera esistente per l'editing
  }

  saveArtwork(): void {
    if (this.artwork) {
      const updatedArtwork: Artwork = {
        id: this.artwork.id,  // Assicura che l'ID non sia undefined
        title: this.editedArtwork.title || this.artwork.title,
        description: this.editedArtwork.description || this.artwork.description,
        price: this.editedArtwork.price ?? this.artwork.price,
        photo: this.editedArtwork.photo || this.artwork.photo,
        imageUrl: this.editedArtwork.imageUrl || this.artwork.imageUrl,
        categoryId: this.editedArtwork.categoryId ?? this.artwork.categoryId,
        artistId: this.artwork.artistId,
        type: this.artwork.type,
        createDate: this.artwork.createDate,
        viewCount: this.artwork.viewCount,
        soldOut: this.artwork.soldOut,
        likesCount: this.artwork.likesCount,
        commentsCount: this.artwork.commentsCount,
        isFavorite: this.artwork.isFavorite
      };

      const artworkData = new FormData();
      Object.entries(updatedArtwork).forEach(([key, value]) => {
        artworkData.append(key, value);
      });

      this.artworkService.updateArtwork(updatedArtwork.id, artworkData).subscribe(
        () => {
          this.artwork = updatedArtwork;
          this.editing = false;
          console.log('Opera aggiornata con successo');
        },
        error => console.error('Errore durante l\'aggiornamento dell\'opera', error)
      );
    }
  }

  deleteArtwork(): void {
    if (this.artwork) {
      this.artworkService.deleteArtwork(this.artwork.id).subscribe(
        () => console.log('Opera eliminata con successo'),
        error => console.error('Errore nell\'eliminazione dell\'opera', error)
      );
    }
  }

  leaveReview(content: string): void {
    if (this.artwork) {
      const commentDto = { artworkId: this.artwork.id, content };
      this.commentService.addComment(commentDto).subscribe(
        newComment => {
          this.comments.push(newComment);  // Aggiorna subito la lista di commenti
          this.newComment = '';  // Pulisci il campo
          console.log('Recensione inviata');
        },
        error => console.error('Errore nell\'invio della recensione', error)
      );
    }
  }

  ngOnDestroy(): void {
    this.artworkSubscription?.unsubscribe();
  }
}
