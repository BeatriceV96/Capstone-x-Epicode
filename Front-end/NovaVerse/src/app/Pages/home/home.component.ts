import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork } from '../../Models/artwork';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  randomArtworks: Artwork[] = [];  // Cambiato a un array, non un Observable

  constructor(private artworkService: ArtworkService) {}

  ngOnInit(): void {
    this.loadRandomArtworks();
  }

  loadRandomArtworks(): void {
    this.artworkService.getRandomArtworks().subscribe(
      (response: any) => {
        this.randomArtworks = response.$values;  // Assegna il valore al normale array

      },
      (error) => {
        console.error('Errore durante il caricamento delle opere casuali', error);
      }
    );
  }
}
