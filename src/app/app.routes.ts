import { Routes } from '@angular/router';

// Define la página inicial de la aplicación.
export const routes: Routes = [
  {
    path: 'home',

    // Carga la página principal cuando se visita /home.
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },

  // Redirige la ruta inicial al Home.
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // Redirige cualquier ruta desconocida al Home.
  {
    path: '**',
    redirectTo: 'home'
  }
];