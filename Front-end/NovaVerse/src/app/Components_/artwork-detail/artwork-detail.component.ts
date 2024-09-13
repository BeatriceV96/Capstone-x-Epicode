import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { AuthService } from '../../services/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { Artwork } from '../../Models/artwork';
import { filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommentService } from '../../services/comment.service.service';
import { CategoryService } from '../../services/category.service';

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
    // Usa ActivatedRoute per ottenere l'ID dell'opera e caricare i dettagli
    this.artwork$ = this.route.paramMap.pipe(
      switchMap(params => {
        const artworkId = Number(params.get('id'));
        return this.artworkService.getArtworkById(artworkId);
      }),
      filter(artwork => !!artwork) // Filtro per assicurarsi che artwork non sia null
    );
    // Carica i commenti per l'opera specifica
    this.artwork$.subscribe(artwork => {
      if (artwork) {
        this.loadComments(artwork.id);
      }
    });
  }

  // Carica i dettagli dell'opera d'arte in modo dinamico usando Observable
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

  // Aggiungi l'opera al carrello
  addToCart(artwork: Artwork): void {
    this.shoppingCartService.addItemToCart(artwork.id).subscribe(
      () => console.log('Opera aggiunta al carrello'),
      (error) => console.error('Errore nell\'aggiunta al carrello', error)
    );
  }

  // Modifica l'opera
  editArtwork(artwork: Artwork): void {
    if (artwork) {
      console.log('Modifica opera:', artwork.id);
    }
  }

  // Elimina l'opera
  deleteArtwork(artwork: Artwork): void {
    this.artworkService.deleteArtwork(artwork.id).subscribe(
      () => console.log('Opera eliminata'),
      (error) => console.error('Errore nell\'eliminazione dell\'opera', error)
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

  // Lascia una recensione
  leaveReview(content: string): void {
    if (this.artwork$) {
      this.artwork$.subscribe((artwork) => {
        if (artwork && artwork.id) {
          const commentDto = { artworkId: artwork.id, content };
          this.commentService.addComment(commentDto).subscribe(
            () => {
              this.comments.push({ content, user: { username: 'Tu' } });
              this.newComment = '';
              console.log('Recensione inviata');
            },
            (error) => console.error('Errore nell\'invio della recensione', error)
          );
        } else {
          console.error('Errore: L\'artwork non è caricato correttamente.');
        }
      });
    }
  }
}
