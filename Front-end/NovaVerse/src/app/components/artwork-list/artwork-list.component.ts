import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { AuthService } from '../../services/auth.service';
import { Artwork } from '../../Models/artwork';

@Component({
  selector: 'app-artwork-list',
  templateUrl: './artwork-list.component.html',
  styleUrls: ['./artwork-list.component.scss']
})
export class ArtworkListComponent implements OnInit {
  artworks: Artwork[] = [];
  categoryId: number | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  isArtist: boolean = false;
  categoryName: string = '';

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; // Prende l'ID della categoria dalla rotta
      if (this.categoryId) {
        this.loadArtworks(this.categoryId);
      }
    });
    this.isArtist = this.authService.isArtist();  // Verifica se l'utente è un artista
  }

  // Carica le opere della categoria
  loadArtworks(categoryId: number): void {
    this.loading = true;
    this.artworkService.getArtworksByCategory(categoryId).subscribe(
      (artworks: Artwork[]) => {
        this.artworks = artworks;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Errore nel caricamento delle opere';
        this.loading = false;
      }
    );
  }
}
