import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cliente } from '../model/cliente';
//import { CLIENTES } from '../components/cliente/clientes.json';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from '../model/region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url:string = 'http://localhost:8080/api/clientes';
  //private httpHeaders = new HttpHeaders({'Content-type':'application/json'})

  constructor( private http:HttpClient, 
               private router: Router) { }

  //Metodo que obtiene todas las regiones
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.url + '/regiones');
  }
  
  //Metodo que retorna todos los clientes paginados
  getClientes(page: number): Observable<any>{
    //#Primera forma para castear los datos
    //return this.http.get<Cliente[]>(this.url);
    //return of(CLIENTES);//Convertimos la lista en cliente en un observable
    //#Segunda forma
    return this.http.get(this.url + '/page/' + page).pipe(
      tap( (response:any) => {
        (response.content as Cliente[]).forEach(cliente => {
          //console.log(cliente.nombre);
        });
      }),
      map( (response:any) => { 
        //Retorna el arreglo cliente
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          let datePipe = new DatePipe('es');
          cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          return cliente;//retornar cada cliente del arreglo
        });
        return response;
      })
    );
  }

  //Metodo que inserta los clientes a la db
  create(cliente:Cliente): Observable<any>{
    return this.http.post<any>(this.url, cliente).pipe(
      catchError(e => {
        //Si desde el servidor retorna un http 400, retornara los mensajes de errores
        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mansaje);
        }
        return throwError(e);
      })
    );
  }

  //Metodo que obtiene todos los clientes
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.url}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mansaje);
        }
        return throwError(e); //Retornamos el error en un observable
      })
    );
  }

  //Metodo que actualiza el cliente
  update(cliente:Cliente): Observable<any>{
    return this.http.put<any>(`${this.url}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mansaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.url}/${id}`).pipe(
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mansaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, idCliente): Observable<HttpEvent<{}>>{//Con el observable, podemos obtener la foto y mostrarlo en el cliente

    let formData = new FormData();//Permite subir una imagen
    formData.append("archivo", archivo);
    formData.append("id", idCliente);
   
    const req = new HttpRequest('POST', `${this.url}/upload`, formData);

    return this.http.request(req);
  }
}
