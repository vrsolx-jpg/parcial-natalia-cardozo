import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Configuración principal de la aplicación.
bootstrapApplication(AppComponent, {
  providers: [
    // Conserva la estrategia de navegación de Ionic.
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // Configura Ionic.
    provideIonicAngular(),

    // Configura las rutas de la aplicación.
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding()
    ),

    // Habilita las peticiones HTTP para consumir la API.
    provideHttpClient(),
  ],
});
