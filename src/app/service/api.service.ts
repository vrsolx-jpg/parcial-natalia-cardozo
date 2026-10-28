import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, timeout } from 'rxjs';
import type { Observable } from 'rxjs';

interface ComentarioRemoto {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export type EstadoCalificacion = 'Aprobada' | 'Reprobada';

export interface Calificacion {
  id: number;
  estudiante: string;
  correo: string;
  asignatura: string;
  nota: number;
  estado: EstadoCalificacion;
  observacion: string;
  revisada: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/comments?_limit=30';

  private readonly muestraAcademica: Omit<Calificacion, 'id' | 'revisada'>[] = [
    {
      estudiante: 'Natalia Cardozo',
      correo: 'natalia.cardozo@colegio.edu',
      asignatura: 'Matemáticas',
      nota: 4.6,
      estado: 'Aprobada',
      observacion: 'Excelente comprensión de los temas y resolución de problemas.',
    },
    {
      estudiante: 'Mariana Arce',
      correo: 'mariana.arce@colegio.edu',
      asignatura: 'Ciencias',
      nota: 3.8,
      estado: 'Aprobada',
      observacion: 'Buen trabajo en las actividades del periodo.',
    },
    {
      estudiante: 'Luis Gómez',
      correo: 'luis.gomez@colegio.edu',
      asignatura: 'Matemáticas',
      nota: 2.7,
      estado: 'Reprobada',
      observacion: 'Debe reforzar operaciones y procedimientos.',
    },
    {
      estudiante: 'Luis Gómez',
      correo: 'luis.gomez@colegio.edu',
      asignatura: 'Historia',
      nota: 3.2,
      estado: 'Aprobada',
      observacion: 'Alcanza los objetivos básicos del periodo.',
    },
    {
      estudiante: 'Sofía Ramírez',
      correo: 'sofia.ramirez@colegio.edu',
      asignatura: 'Lengua',
      nota: 4.9,
      estado: 'Aprobada',
      observacion: 'Destaca en lectura, análisis y expresión escrita.',
    },
    {
      estudiante: 'Mateo Torres',
      correo: 'mateo.torres@colegio.edu',
      asignatura: 'Ciencias',
      nota: 2.4,
      estado: 'Reprobada',
      observacion: 'Se recomienda repasar los conceptos vistos en clase.',
    },
    {
      estudiante: 'Valentina Rojas',
      correo: 'valentina.rojas@colegio.edu',
      asignatura: 'Historia',
      nota: 4.1,
      estado: 'Aprobada',
      observacion: 'Buen análisis de los procesos históricos.',
    },
    {
      estudiante: 'Diego Herrera',
      correo: 'diego.herrera@colegio.edu',
      asignatura: 'Tecnología',
      nota: 3.0,
      estado: 'Aprobada',
      observacion: 'Cumple el mínimo requerido para aprobar.',
    },
    {
      estudiante: 'Camila Castro',
      correo: 'camila.castro@colegio.edu',
      asignatura: 'Matemáticas',
      nota: 4.3,
      estado: 'Aprobada',
      observacion: 'Muy buen desempeño en los ejercicios prácticos.',
    },
    {
      estudiante: 'Samuel Ortiz',
      correo: 'samuel.ortiz@colegio.edu',
      asignatura: 'Lengua',
      nota: 2.9,
      estado: 'Reprobada',
      observacion: 'Le falta poco para alcanzar el nivel aprobatorio.',
    },
    {
      estudiante: 'Isabella Molina',
      correo: 'isabella.molina@colegio.edu',
      asignatura: 'Ciencias',
      nota: 3.5,
      estado: 'Aprobada',
      observacion: 'Buen trabajo; puede profundizar en sus conclusiones.',
    },
    {
      estudiante: 'Nicolás Vargas',
      correo: 'nicolas.vargas@colegio.edu',
      asignatura: 'Tecnología',
      nota: 1.8,
      estado: 'Reprobada',
      observacion: 'Debe entregar las actividades pendientes del periodo.',
    },
    {
      estudiante: 'Mariana Silva',
      correo: 'mariana.silva@colegio.edu',
      asignatura: 'Historia',
      nota: 4.7,
      estado: 'Aprobada',
      observacion: 'Excelente participación y apropiación de los contenidos.',
    },
    {
      estudiante: 'Gabriel Ruiz',
      correo: 'gabriel.ruiz@colegio.edu',
      asignatura: 'Matemáticas',
      nota: 3.4,
      estado: 'Aprobada',
      observacion: 'Supera los objetivos básicos de la asignatura.',
    },
    {
      estudiante: 'Daniela López',
      correo: 'daniela.lopez@colegio.edu',
      asignatura: 'Lengua',
      nota: 2.5,
      estado: 'Reprobada',
      observacion: 'Se sugiere practicar comprensión lectora.',
    },
  ];

  private readonly http = inject(HttpClient);

  obtenerCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<ComentarioRemoto[]>(this.apiUrl).pipe(
      timeout({ first: 8000 }),
      // La API solo valida la conexión; los comentarios no son datos académicos.
      map(() => this.obtenerCalificacionesDemo()),
    );
  }

  obtenerCalificacionesDemo(): Calificacion[] {
    return this.muestraAcademica.map((calificacion, index) => ({
      ...calificacion,
      id: index + 1,
      revisada: false,
    }));
  }
}
