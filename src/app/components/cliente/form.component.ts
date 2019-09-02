import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: []
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo:string = "Crear cliente";
  private errores:string[];

  constructor(private _clienteService:ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      //Si existe el id
      if(id){
        this._clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        )
      }
    })
  }
  //En el segundo parametro podemos subscribir a un observador y manejarlo si sale mal
  create(): void{
    this._clienteService.create(this.cliente)
    .subscribe( json => { 
        this.router.navigate(['/clientes']); 
        Swal.fire('Nuevo cliente', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log(err.error.errors);
        console.log('Codigo de error: '+ err.status);
      }
    );
  }

  update(): void{
    this._clienteService.update(this.cliente)
    .subscribe(json => {
      this.router.navigate(['/clientes']); 
      Swal.fire('Cliente actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.log(err.error.errors);
      console.log('Codigo de error: '+ err.status);
    })
  }

}
