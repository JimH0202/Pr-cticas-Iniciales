import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <nav>
          <a routerLink="/home">Inicio</a>
          <a routerLink="/create-publication">Crear Publicación</a>
          <a routerLink="/profile/{{currentUser?.registro}}">Mi Perfil</a>
          <button (click)="logout()">Cerrar Sesión</button>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container { font-family: Arial, sans-serif; }
    header { background: #007bff; color: white; padding: 1rem; }
    nav { display: flex; gap: 1rem; align-items: center; }
    nav a { color: white; text-decoration: none; }
    nav button { background: #dc3545; color: white; border: none; padding: 0.5rem; cursor: pointer; }
    main { padding: 1rem; }
  `]
})
export class AppComponent {
  currentUser: any = JSON.parse(localStorage.getItem('user') || 'null');

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}