import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { Subscription, interval } from 'rxjs';
import { Artwork } from '../../Models/artwork';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  randomArtworks: Artwork[] = [];
  private subscription!: Subscription;

  constructor(private artworkService: ArtworkService, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.loadRandomArtworks();

    // Cambia le opere ogni 3 secondi
    this.subscription = interval(3000).subscribe(() => {
      this.animateCardLeave(); // Applica l'animazione di uscita
      setTimeout(() => {
        this.loadRandomArtworks(); // Carica nuove immagini random
      }, 500);  // Attendi che l'animazione di uscita finisca (500ms)
    });
  }

  loadRandomArtworks(): void {
    this.artworkService.getRandomArtworks().subscribe(
      (response: any) => {
        this.randomArtworks = response.$values;
        this.animateCardEnter(); // Applica l'animazione di entrata
      },
      (error) => {
        console.error('Errore durante il caricamento delle opere casuali', error);
      }
    );
  }

  animateCardLeave(): void {
    const cards = this.el.nativeElement.querySelectorAll('.artwork-card');
    cards.forEach((card: HTMLElement) => {
      this.renderer.addClass(card, 'card-leave'); // Applica la classe per l'uscita
    });
  }

  animateCardEnter(): void {
    const cards = this.el.nativeElement.querySelectorAll('.artwork-card');
    cards.forEach((card: HTMLElement) => {
      this.renderer.removeClass(card, 'card-leave'); // Rimuovi l'animazione di uscita
      this.renderer.addClass(card, 'card-enter'); // Applica la classe per l'entrata
      setTimeout(() => {
        this.renderer.removeClass(card, 'card-enter');
        this.renderer.addClass(card, 'card-enter-active');
      }, 10); // Piccolo ritardo per attivare la transizione
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
