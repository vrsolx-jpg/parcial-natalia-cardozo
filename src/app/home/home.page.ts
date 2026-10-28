import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';

import { ApiService, type Calificacion } from '../service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    IonAvatar,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonNote,
    IonRow,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toastController = inject(ToastController);

  calificaciones: Calificacion[] = [];
  cargando = false;
  errorCarga = '';

  busqueda = '';
  asignaturaSeleccionada = 'Todas';
  notaMinima: number | null = null;

  modalAbierto = false;
  calificacionSeleccionada: Calificacion | null = null;

  ngOnInit(): void {
    this.cargarCalificaciones();
  }

  get asignaturas(): string[] {
    return [...new Set(this.calificaciones.map(({ asignatura }) => asignatura))].sort();
  }

  get notaMinimaInvalida(): boolean {
    return (
      this.notaMinima !== null && (!Number.isFinite(this.notaMinima) || this.notaMinima < 1 || this.notaMinima > 5)
    );
  }

  get calificacionesFiltradas(): Calificacion[] {
    if (this.notaMinimaInvalida) {
      return [];
    }

    const termino = this.busqueda.trim().toLocaleLowerCase();

    return this.calificaciones
      .filter((calificacion) => {
        const coincideBusqueda =
          !termino ||
          calificacion.estudiante.toLocaleLowerCase().includes(termino) ||
          calificacion.correo.toLocaleLowerCase().includes(termino);
        const coincideAsignatura =
          this.asignaturaSeleccionada === 'Todas' || calificacion.asignatura === this.asignaturaSeleccionada;
        const cumpleNota = this.notaMinima === null || calificacion.nota >= this.notaMinima;

        return coincideBusqueda && coincideAsignatura && cumpleNota;
      })
      .sort((a, b) => a.estudiante.localeCompare(b.estudiante));
  }

  get promedio(): number {
    const visibles = this.calificacionesFiltradas;
    if (visibles.length === 0) {
      return 0;
    }

    const suma = visibles.reduce((total, calificacion) => total + calificacion.nota, 0);
    return Number((suma / visibles.length).toFixed(1));
  }

  get cantidadAprobados(): number {
    return this.calificacionesFiltradas.filter((calificacion) => calificacion.estado === 'Aprobada').length;
  }

  cargarCalificaciones(): void {
    this.cargando = true;
    this.errorCarga = '';

    this.apiService.obtenerCalificaciones().subscribe({
      next: (calificaciones) => {
        this.calificaciones = calificaciones;
        this.cargando = false;
      },
      error: () => {
        this.calificaciones = this.apiService.obtenerCalificacionesDemo();
        this.errorCarga =
          'No fue posible consultar la API de comentarios. Se muestran calificaciones académicas locales de demostración.';
        this.cargando = false;
      },
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.asignaturaSeleccionada = 'Todas';
    this.notaMinima = null;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toLocaleUpperCase())
      .join('');
  }

  abrirModal(calificacion: Calificacion): void {
    this.calificacionSeleccionada = calificacion;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.calificacionSeleccionada = null;
  }

  async confirmarRevision(): Promise<void> {
    const seleccionada = this.calificacionSeleccionada;
    if (!seleccionada || seleccionada.revisada) {
      return;
    }

    seleccionada.revisada = true;
    this.cerrarModal();
    const toast = await this.toastController.create({
      message: 'Calificación marcada como revisada',
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }
}
