import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="register-container">
      <h2>Registro</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Registro Académico:</label>
          <input type="text" [(ngModel)]="registro" name="registro" required>
        </div>
        <div>
          <label>Nombres:</label>
          <input type="text" [(ngModel)]="nombres" name="nombres" required>
        </div>
        <div>
          <label>Apellidos:</label>
          <input type="text" [(ngModel)]="apellidos" name="apellidos" required>
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input type="email" [(ngModel)]="email" name="email" required>
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit" [disabled]="loading">Registrarse</button>
      </form>
      <p *ngIf="error">{{ error }}</p>
      <a routerLink="/login">¿Ya tienes cuenta? Inicia sesión</a>
    </div>
  `,
  styles: [`
    .register-container { max-width: 400px; margin: 0 auto; padding: 2rem; }
    form div { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input { width: 100%; padding: 0.5rem; }
    button { width: 100%; padding: 0.75rem; background: #28a745; color: white; border: none; cursor: pointer; }
    button:disabled { background: #ccc; }
    p { color: red; }
  `]
})
export class RegisterComponent {
  registro = '';
  nombres = '';
  apellidos = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.http.post('http://localhost:3000/api/auth/register', {
      registro: this.registro,
      nombres: this.nombres,
      apellidos: this.apellidos,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error en el registro';
        this.loading = false;
      }
    });
  }
}