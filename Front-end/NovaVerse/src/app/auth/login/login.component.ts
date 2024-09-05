import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.authData).subscribe(
      () => {
        Swal.fire('Success', 'Login effettuato con successo!', 'success');
        this.router.navigate(['/dashboard']);
      },
      () => {
        Swal.fire('Error', 'Email o Password errati', 'error');
      }
    );
  }
}
