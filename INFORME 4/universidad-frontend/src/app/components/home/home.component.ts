import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Publicacion {
  id: number;
  mensaje: string;
  created_at: string;
  usuario_registro: string;
  usuario_nombres: string;
  usuario_apellidos: string;
  curso_nombre?: string;
  profesor_nombres?: string;
  profesor_apellidos?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="home-container">
      <h2>Publicaciones</h2>
      <div class="filters">
        <input type="text" [(ngModel)]="filters.cursoNombre" placeholder="Buscar por nombre de curso" name="cursoNombre">
        <input type="text" [(ngModel)]="filters.profesorNombre" placeholder="Buscar por nombre de profesor" name="profesorNombre">
        <button (click)="loadPublicaciones()">Buscar</button>
      </div>
      <div class="publicaciones">
        <div *ngFor="let pub of publicaciones" class="publicacion">
          <div class="header">
            <strong>{{ pub.usuario_nombres }} {{ pub.usuario_apellidos }} ({{ pub.usuario_registro }})</strong>
            <span>{{ pub.created_at | date:'short' }}</span>
          </div>
          <p>{{ pub.mensaje }}</p>
          <p *ngIf="pub.curso_nombre">Curso: {{ pub.curso_nombre }}</p>
          <p *ngIf="pub.profesor_nombres">Profesor: {{ pub.profesor_nombres }} {{ pub.profesor_apellidos }}</p>
          <button (click)="viewDetails(pub.id)">Ver Comentarios</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container { max-width: 800px; margin: 0 auto; }
    .filters { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .filters input { flex: 1; padding: 0.5rem; }
    .publicacion { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; }
    .header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    button { background: #007bff; color: white; border: none; padding: 0.5rem; cursor: pointer; }
  `]
})
export class HomeComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  filters = { cursoNombre: '', profesorNombre: '' };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPublicaciones();
  }

  loadPublicaciones() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<Publicacion[]>('http://localhost:3000/api/publicaciones', {
      headers,
      params: this.filters
    }).subscribe({
      next: (data) => this.publicaciones = data,
      error: (err) => console.error(err)
    });
  }

  viewDetails(id: number) {
    // Navegar a detalles o mostrar modal
    alert('Ver detalles de publicación ' + id);
  }
}