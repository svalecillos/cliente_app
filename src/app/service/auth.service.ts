import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  //Getters
  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario;
    } else if(this._usuario == null && sessionStorage.getItem('usuario') != null){//Si _usuario es nulo pero existe en el sessionStorage
      //COmo sessionStorage retorna un string lo transformamos en un objeto JSON
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  //Getters
  public get token(): string{
    if(this._token != null){
      return this._token;
    } else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario:Usuario):Observable<any>{
    
    const urlEndpoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');//Encripta el string base64
    const cabezera = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded', 
                                      'Authorization' : 'Basic ' + credenciales});
    
    let  params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    console.log(params.toString());

    return this.http.post<any>(urlEndpoint, params.toString(), {headers: cabezera});
  }

  guardarUsuario(accessToken: string):void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    // JSON.stringify convierte un objeto en un string
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));//Nos permite guardar datos en la seccion del navegador
  }

  guardarToken(accessToken: string):void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string):any{
    if(accessToken != null){
      //JSON.parse convierte un string en un objeto JSON
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }
  
  //Metodo que verifica si esta autenticado el usuario
  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name ){
      return true;
    }
    return false;
  }

  hasRole(role:string): boolean{
    //includes valida si existe algun elemento en ese arreglo
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  logout():void{
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    //En caso de no querer eliminar todo.
    /*sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');*/
  }



}
