import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

//Guard que proteje las rutas validando el rol del usuario autenticado
export class RoleGuard implements CanActivate {

constructor(private _authService: AuthService,
            private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      //Si no esta autenticado
      if(!this._authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }

    let role = next.data['role'] as string;
    console.log(role);
    if(this._authService.hasRole(role)){
      return true;
    }

    Swal.fire('Acceso denegado', `Hola ${this._authService.usuario.username} no tienes acceso a este recurso`, 'warning');
    this.router.navigate(['/clientes']);

    return false;
  }
}
