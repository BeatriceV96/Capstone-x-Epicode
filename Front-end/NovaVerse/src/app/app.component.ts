import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTopButton = document.getElementById('scrollToTopBtn');
    if (scrollTopButton) {
      if (window.pageYOffset > 300) {  // Appare solo dopo aver scrollato 300px
        scrollTopButton.style.display = 'block';
      } else {
        scrollTopButton.style.display = 'none';
      }
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });  // Scrolla fino all'inizio con effetto smooth
  }
}
