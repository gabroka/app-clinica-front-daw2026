import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { AuthStore } from "./auth-store";

// Función interceptora HTTP para añadir de forma automática el token de autenticación a las peticiones
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {


// Obtiene el token de autenticación actual desde el store
  const authToken = inject(AuthStore).obtenerToken();

  // Si no existe un token guardado la petición se envía tal cual sin modificar
  if (!authToken) {
    return next(req);
  }
  
  // Si el token existe, clona la petición HTTP original y le agrega la cabecera 'Authorization' con el formato Bearer
  const reqWithToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`)
  });

  // Pasa la petición clonada (junto con el token) 
  return next(reqWithToken);
}