import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

//Punto de entrada principal de la app en modo Standalone.
 // Inicializa y arranca la aplicación cargando el componente raíz (App) 
 // junto con su configuración global de proveedores y dependencias (appConfig).
bootstrapApplication(App, appConfig)

//Captura y registra en la consola cualquier error crítico
// ocurrido durante el inicio de la aplicación
  .catch((err) => console.error(err));
