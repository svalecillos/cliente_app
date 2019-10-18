import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Factura } from '../model/factura';
import { Producto } from '../model/producto';


@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndPoint: string = 'http://localhost:8080/api/facturas';

  constructor( private http: HttpClient) { }

  getFactura(id:number):Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  //Eliminar factura
  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(termino:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${termino}`);
  }

  create(factura: Factura):Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }
}
