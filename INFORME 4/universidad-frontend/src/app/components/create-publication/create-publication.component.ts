import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-publication',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="create-pub-container">
      <h2>Crear Publicación</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Tipo:</label>
          <select [(ngModel)]="tipo" name="tipo" required>
            <option value="curso">Sobre un Curso</option>
            <option value="profesor">Sobre un Catedrático</option>
          </select>
        </div>
        <div *ngIf="tipo === 'curso'">
          <label>Seleccionar Curso:</label>
          <select [(ngModel)]="cursoId" name="cursoId" required>
            <option value="">Seleccionar</option>
            <option *ngFor="let curso of cursos" [value]="curso.id">{{ curso.nombre }}</option>
          </select>
        </div>
        <div *ngIf="tipo === 'profesor'">
          <label>Seleccionar Catedrático:</label>
          <select [(ngModel)]="profesorId" name="profesorId" required>
            <option value="">Seleccionar</option>
            <option *ngFor="let prof of profesores" [value]="prof.id">{{ prof.nombres }} {{ prof.apellidos }}</option>
          </select>
        </div>
        <div>
          <label>Mensaje:</label>
          <textarea [(ngModel)]="mensaje" name="mensaje" required rows="4"></textarea>
        </div>
        <button type="submit" [disabled]="loading">Publicar</button>
      </form>
      <p *ngIf="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .create-pub-container { max-width: 600px; margin: 0 auto; padding: 2rem; }
    form div { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    select, textarea { width: 100%; padding: 0.5rem; }
    button { padding: 0.75rem; background: #28a745; color: white; border: none; cursor: pointer; width: 100%; }
    button:disabled { background: #ccc; }
    p { color: red; }
  `]
})
export class CreatePublicationComponent implements OnInit {
  tipo = 'curso';
  cursoId = '';
  profesorId = '';
  mensaje = '';
  loading = false;
  error = '';
  cursos: any[] = [];
  profesores: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCursos();
    this.loadProfesores();
  }

  loadCursos() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ cursos: any[] }>('http://localhost:3000/api/cursos', { headers })
      .subscribe({
        next: (data) => this.cursos = data.cursos,
        error: (err) => console.error(err)
      });
  }

  loadProfesores() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ profesores: any[] }>('http://localhost:3000/api/profesores', { headers })
      .subscribe({
        next: (data) => this.profesores = data.profesores,
        error: (err) => console.error(err)
      });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const payload = {
      mensaje: this.mensaje,
      cursoId: this.tipo === 'curso' ? this.cursoId : null,
      profesorId: this.tipo === 'profesor' ? this.profesorId : null
    };
    this.http.post('http://localhost:3000/api/publicaciones', payload, { headers })
      .subscribe({
        next: () => {
          alert('Publicación creada');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.error = err.error?.error || 'Error al crear publicación';
          this.loading = false;
        }
      });
  }
}