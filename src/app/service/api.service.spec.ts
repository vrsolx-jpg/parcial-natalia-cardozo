import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('uses the remote endpoint and returns a complete local academic sample', async () => {
    const resultPromise = firstValueFrom(service.obtenerCalificaciones());
    const request = httpTestingController.expectOne('https://jsonplaceholder.typicode.com/comments?_limit=30');

    request.flush([
      {
        postId: 1,
        id: 1,
        name: 'Comentario remoto',
        email: 'comentario@example.com',
        body: 'Este texto no es una nota académica.',
      },
    ]);

    const calificaciones = await resultPromise;
    expect(calificaciones).toHaveLength(15);
    expect(calificaciones[0]).toMatchObject({
      estudiante: 'Ana Pérez',
      correo: 'ana.perez@colegio.edu',
      asignatura: 'Matemáticas',
      nota: 4.6,
      estado: 'Aprobada',
    });
    expect(calificaciones.some(({ estudiante }) => estudiante === 'Comentario remoto')).toBe(false);
    expect(new Set(calificaciones.map(({ asignatura }) => asignatura)).size).toBeGreaterThan(1);
    expect(new Set(calificaciones.map(({ nota }) => nota)).size).toBeGreaterThan(1);
  });

  it('returns independent local demo records with valid academic grades', () => {
    const firstLoad = service.obtenerCalificacionesDemo();
    const secondLoad = service.obtenerCalificacionesDemo();

    expect(firstLoad).toHaveLength(15);
    expect(firstLoad.every(({ nota }) => nota >= 1 && nota <= 5)).toBe(true);
    expect(firstLoad.every(({ estado, nota }) => estado === (nota >= 3 ? 'Aprobada' : 'Reprobada'))).toBe(true);
    expect(firstLoad[0]).not.toBe(secondLoad[0]);
    expect(secondLoad[0].revisada).toBe(false);
  });
});
