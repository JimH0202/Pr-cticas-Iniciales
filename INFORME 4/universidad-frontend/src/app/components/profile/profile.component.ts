import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Usuario {
  id: number;
  registro: string;
  nombres: string;
  apellidos: string;
  email: string;
}

interface CursoAprobado {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="profile-container">
      <h2>Perfil de {{ usuario?.registro }}</h2>
      <div *ngIf="usuario">
        <p><strong>Nombre:</strong> {{ usuario.nombres }} {{ usuario.apellidos }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <div *ngIf="isOwnProfile">
          <h3>Editar Perfil</h3>
          <form (ngSubmit)="updateProfile()">
            <input [(ngModel)]="editForm.nombres" placeholder="Nombres" name="nombres">
            <input [(ngModel)]="editForm.apellidos" placeholder="Apellidos" name="apellidos">
            <input [(ngModel)]="editForm.email" placeholder="Email" name="email">
            <input type="password" [(ngModel)]="editForm.password" placeholder="Nueva contraseña (opcional)" name="password">
            <button type="submit">Actualizar</button>
          </form>
        </div>
        <h3>Cursos Aprobados</h3>
        <ul>
          <li *ngFor="let curso of cursosAprobados">{{ curso.nombre }} ({{ curso.creditos }} créditos)</li>
        </ul>
        <p><strong>Total Créditos:</strong> {{ totalCreditos }}</p>
        <div *ngIf="isOwnProfile">
          <h4>Agregar Curso Aprobado</h4>
          <select [(ngModel)]="nuevoCursoId">
            <option value="">Seleccionar curso</option>
            <option *ngFor="let curso of allCursos" [value]="curso.id">{{ curso.nombre }}</option>
          </select>
          <button (click)="addCurso()">Agregar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 600px; margin: 0 auto; }
    form { display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0; }
    input, select { padding: 0.5rem; }
    button { padding: 0.5rem; background: #007bff; color: white; border: none; cursor: pointer; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.5rem; border-bottom: 1px solid #ddd; }
  `]
})
export class ProfileComponent implements OnInit {
  registro = '';
  usuario: Usuario | null = null;
  cursosAprobados: CursoAprobado[] = [];
  allCursos: any[] = [];
  totalCreditos = 0;
  isOwnProfile = false;
  editForm = { nombres: '', apellidos: '', email: '', password: '' };
  nuevoCursoId = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.registro = this.route.snapshot.paramMap.get('registro') || '';
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.isOwnProfile = currentUser.registro === this.registro;
    this.loadProfile();
    this.loadCursosAprobados();
    if (this.isOwnProfile) {
      this.loadAllCursos();
    }
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ usuario: Usuario }>(`http://localhost:3000/api/usuarios/${this.registro}`, { headers })
      .subscribe({
        next: (data) => {
          this.usuario = data.usuario;
          this.editForm = { ...this.usuario, password: '' };
        },
        error: (err) => console.error(err)
      });
  }

  loadCursosAprobados() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ cursos: CursoAprobado[] }>(`http://localhost:3000/api/usuarios/${this.registro}/cursos-aprobados`, { headers })
      .subscribe({
        next: (data) => {
          this.cursosAprobados = data.cursos;
          this.totalCreditos = this.cursosAprobados.reduce((sum, c) => sum + c.creditos, 0);
        },
        error: (err) => console.error(err)
      });
  }

  loadAllCursos() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<{ cursos: any[] }>('http://localhost:3000/api/cursos', { headers })
      .subscribe({
        next: (data) => this.allCursos = data.cursos,
        error: (err) => console.error(err)
      });
  }

  updateProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.put('http://localhost:3000/api/usuarios', this.editForm, { headers })
      .subscribe({
        next: () => {
          alert('Perfil actualizado');
          this.loadProfile();
        },
        error: (err) => console.error(err)
      });
  }

  addCurso() {
    if (!this.nuevoCursoId) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post(`http://localhost:3000/api/usuarios/${this.registro}/cursos-aprobados`, { cursoId: this.nuevoCursoId }, { headers })
      .subscribe({
        next: () => {
          this.loadCursosAprobados();
          this.nuevoCursoId = '';
        },
        error: (err) => console.error(err)
      });
  }
}