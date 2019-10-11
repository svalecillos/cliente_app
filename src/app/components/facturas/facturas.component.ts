import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/model/factura';
import { ClienteService } from 'src/app/service/cliente.service';
import { ActivatedRoute } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: []
})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva factura';
  factura:Factura = new Factura();

  autocompleteControl = new FormControl();
  productos: string[] = ['Mesa', 'Lapto', 'Silla', 'Muñeca', 'Zapato'];
  productosFiltrados: Observable<string[]>;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params =>{
      let clienteId = +params.get('clienteId')//Convertimos a integer
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  }

}
