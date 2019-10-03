import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
//Guard que protegue las rutas asignadas validando si esta autenticado
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      //Valida si esta autenticado
      if(this.authService.isAuthenticated()){
        if(this.isTokenExpirado()){
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
      this.router.navigate(['/login']);
      return false;
  }

  //Metodo que valida si el token a expirado
  isTokenExpirado():boolean{
    //invocamos el metodo get del token de la clase AuthService
    let token = this.authService.token;
    let payload =  this.authService.obtenerDatosToken(token);
    console.log("Fecha actual "+new Date().getTime());
    let now = new Date().getTime()/1000; //Obtenemos la fecha en segundos
    //Si la fecha de expericion es menor a la fecha actual, expiro
    if(payload.exp < now){
      return true;
    }

    return false;
  }
}
