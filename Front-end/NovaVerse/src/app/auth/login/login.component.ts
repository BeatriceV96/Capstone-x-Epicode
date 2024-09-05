import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: [''],  // In linea con il backend (usa "username")
      password: ['']
    });
  }

  onLogin(): void {
    const loginData = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(loginData).subscribe(
      (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/']);  // Cambia il percorso della rotta dopo il login se necessario
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}
