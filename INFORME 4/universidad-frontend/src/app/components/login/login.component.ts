import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Registro Académico:</label>
          <input type="text" [(ngModel)]="registro" name="registro" required>
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit" [disabled]="loading">Iniciar Sesión</button>
      </form>
      <p *ngIf="error">{{ error }}</p>
      <a routerLink="/register">¿No tienes cuenta? Regístrate</a>
      <br>
      <a href="#" (click)="forgotPassword()">¿Olvidaste tu contraseña?</a>
    </div>
  `,
  styles: [`
    .login-container { max-width: 400px; margin: 0 auto; padding: 2rem; }
    form div { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input { width: 100%; padding: 0.5rem; }
    button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; cursor: pointer; }
    button:disabled { background: #ccc; }
    p { color: red; }
  `]
})
export class LoginComponent {
  registro = '';
  password = '';
  loading = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.http.post('http://localhost:3000/api/auth/login', { registro: this.registro, password: this.password })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.error = err.error?.error || 'Error al iniciar sesión';
          this.loading = false;
        }
      });
  }

  forgotPassword() {
    const email = prompt('Ingresa tu correo electrónico:');
    if (email) {
      this.http.post('http://localhost:3000/api/auth/forgot-password', { registro: this.registro, email })
        .subscribe({
          next: () => alert('Contraseña enviada a tu correo'),
          error: () => alert('Error al enviar contraseña')
        });
    }
  }
}