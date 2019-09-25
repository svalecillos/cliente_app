import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cliente } from '../model/cliente';
//import { CLIENTES } from '../components/cliente/clientes.json';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from '../model/region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url:string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'})

  constructor( private http:HttpClient, private router: Router ) { }

  private isNoAutorizado(error): boolean{
    //401 significa Unauthorized indica que la peticion no ha sido ejecutada
    //porque carece de credenciales validas de autenticacion.
    //403 significa Forbidden en respuesta a un cliente de una pagina web o servicio
    //indica que el servidor se niega a permitir la accion solicitada.
    if(error.status==401 || error.status==403){
      //Ridirigue a la pagina de login
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }

  //Metodo que obtiene todas las regiones
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.url + '/regiones').pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
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
    return this.http.post<any>(this.url, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        //Si desde el servidor retorna un http 400, retornara los mensajes de errores
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  //Metodo que obtiene todos los clientes
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.url}/${id}`).pipe(
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e); //Retornamos el error en un observable
      })
    );
  }

  //Metodo que actualiza el cliente
  update(cliente:Cliente): Observable<any>{
    return this.http.put<any>(`${this.url}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.url}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, idCliente): Observable<Cliente>{//Con el observable, podemos obtener la foto y mostrarlo en el cliente

    let formData = new FormData();//Permite subir una imagen
    formData.append("archivo", archivo);
    formData.append("id", idCliente);

    return this.http.post(`${this.url}/upload/`, formData).pipe(
      map((response: any ) => response.cliente as Cliente),
        catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
    );
  }
}
