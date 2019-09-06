import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cliente } from '../model/cliente';
//import { CLIENTES } from '../components/cliente/clientes.json';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url:string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'})

  constructor( private http:HttpClient, private router: Router ) { }
  
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

  create(cliente:Cliente): Observable<any>{
    return this.http.post<any>(this.url, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        //Si desde el servidor retorna un http 400, retornara los mensajes de errores
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.url}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e); //Retornamos el error en un observable
      })
    );
  }

  update(cliente:Cliente): Observable<any>{
    return this.http.put<any>(`${this.url}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
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
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
    );
    
  }
}
