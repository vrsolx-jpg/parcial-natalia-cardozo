import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';

import { ApiService, type Calificacion } from '../service/api.service';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const calificaciones: Calificacion[] = [
    {
      id: 1,
      estudiante: 'Ana Pérez',
      correo: 'ana@example.com',
      asignatura: 'Matemáticas',
      nota: 4.2,
      estado: 'Aprobada',
      observacion: 'Buen desempeño',
      revisada: false,
    },
    {
      id: 2,
      estudiante: 'Luis Gómez',
      correo: 'luis@example.com',
      asignatura: 'Historia',
      nota: 2.8,
      estado: 'Reprobada',
      observacion: 'Debe reforzar los temas',
      revisada: false,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ApiService,
          useValue: { obtenerCalificaciones: () => of(calificaciones) },
        },
        { provide: ToastController, useValue: { create: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates metrics and filters without changing the source records', () => {
    expect(component.promedio).toBe(3.5);
    expect(component.cantidadAprobados).toBe(1);

    component.asignaturaSeleccionada = 'Matemáticas';
    expect(component.calificacionesFiltradas.map(({ estudiante }) => estudiante)).toEqual(['Ana Pérez']);
    expect(component.calificaciones).toHaveLength(2);
  });

  it('rejects a minimum grade outside the valid range', () => {
    component.notaMinima = 5.1;

    expect(component.notaMinimaInvalida).toBe(true);
    expect(component.calificacionesFiltradas).toEqual([]);
  });
});
