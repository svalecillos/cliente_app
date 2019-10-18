import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/model/factura';
import { ClienteService } from 'src/app/service/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import { FacturasService } from 'src/app/service/facturas.service';
import { Producto } from 'src/app/model/producto';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemsFactura } from 'src/app/model/itemsFactura';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: []
})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva factura';
  factura:Factura = new Factura();

  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private FacturasService: FacturasService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params =>{
      let clienteId = +params.get('clienteId')//Convertimos a integer
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string'? value: value.nombre),
        flatMap(value => value ? this._filter(value): [])//Si existe los productos, los retorna, sino retorna un producto vacios
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.FacturasService.filtrarProductos(filterValue);
  }

  //Con parametros opcionales, puede retornar un string o un valor indefinido
  mostrarNombre(producto?: Producto):string | undefined {
    return producto? producto.nombre: undefined
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
    //Con as convertimos este objeto generico a un tipo producto 
     let producto = event.option.value as Producto;
     console.log(producto);

     if(this.existeItem(producto.id)){
       this.incrementaCantidad(producto.id);
     }else{
      //Creamos el nuevo item
      let nuevoItem = new ItemsFactura();
      nuevoItem.producto = producto;
      //Añadimos el producto a la factura
      this.factura.items.push(nuevoItem);
    }
    
      //Para volver a buscar otro producto para  y añardir otro a la factura 
      this.autocompleteControl.setValue('');
      event.option.focus();
      event.option.deselect();
  }

  //Actualiza la cantidad del producto
  actualizarCantidad(id:number, event:any): void{
    let cantidad:number = event.target.value as number;

    if(cantidad==0){
      return this.eliminarItemFactura(id);
    }
    
    this.factura.items = this.factura.items.map((item:ItemsFactura) => {
      console.log(cantidad);
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });//Usamos el map para cambiar los valores de los elementos
  }

  //Verifica si el objeto ingresado ya esta agregado
  existeItem(id:number):boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemsFactura) => {
      if(id === item.producto.id){
        existe = true;
      }
    })
    return existe;
  }

  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemsFactura) => {
      if(id === item.producto.id){
        ++item.cantidad;
        //item.cantidad = item.cantidad+1; -> Es lo mismo
      }
      return item;
    });//Usamos el map para cambiar los valores de los elementos
  }

  eliminarItemFactura(id: number):void{
    //Filtrar todos los productos cuando el id se distinto al id del producto
    this.factura.items = this.factura.items.filter((item: ItemsFactura) => id !== item.producto.id);
  }

  create(facturaForm):void{
    console.log(this.factura);

    //Si no hay elementos en la lista, el formulario es invalido
    if(this.factura.items.length == 0){
      this.autocompleteControl.setErrors({ 'invalid':true });
    }

    if(facturaForm.form.valid && this.factura.items.length  > 0){
      
      this.FacturasService.create(this.factura).subscribe(factura => {
        Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito!`, 'success');
        this.router.navigate(['/clientes']);
      });
    }
  }
}
