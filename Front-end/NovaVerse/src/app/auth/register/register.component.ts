import { Component } from '@angular/core';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  newUser = { nome: '', email: '', password: '', role: 'Cliente' };  // Valore di default per il ruolo

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.newUser).subscribe(
      () => {
        Swal.fire('Success', 'Registrazione completata!', 'success');
        this.router.navigate(['/login']);  // Reindirizza al login dopo la registrazione
      },
      () => {
        Swal.fire('Error', 'Errore nella registrazione', 'error');
      }
    );
  }
}
