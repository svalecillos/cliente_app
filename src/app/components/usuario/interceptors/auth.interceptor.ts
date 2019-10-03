import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router, ){ }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      catchError(error => {
        //401 significa Unauthorized indica que la peticion no ha sido ejecutada
        //porque carece de credenciales validas de autenticacion.
        //403 significa Forbidden en respuesta a un cliente de una pagina web o servicio
        //indica que el servidor se niega a permitir la accion solicitada.
        if(error.status==401){
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          //Ridirigue a la pagina de login
          this.router.navigate(['/login'])
        }

        if(error.status==403){
          //Ridirigue a la pagina de login
          Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
          this.router.navigate(['/clientes']);
        }

        return throwError(error);
      })
    );
  }
}
