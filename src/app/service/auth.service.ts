import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(usuario:Usuario):Observable<any>{
    
    const urlEndpoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');//Encripta el string base64
    const cabezera = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded', 
                                      'Authorization' : 'Basic ' + credenciales});
    
    let  params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    console.log(urlEndpoint);
    console.log(credenciales);
    console.log(cabezera);
    console.log(params.toString());

    return this.http.post<any>(urlEndpoint, params.toString(), {headers: cabezera});
  }

}
