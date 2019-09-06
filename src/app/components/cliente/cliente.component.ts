import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../model/cliente';
import { ModalService } from '../../service/modal.service';
import { ClienteService } from 'src/app/service/cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado:Cliente;

  constructor(private _clienteService: ClienteService,
              private _modalService: ModalService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //Creamos un observable para que detecte los cambios del paginador, con el fin de campiar el parametro page
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');//Convertimos un string a number con el operador +
      if(!page){
        page = 0;
      }
      this._clienteService.getClientes(page).subscribe(
        //Argumento (clientes)
        response => {
          this.clientes = response.content as Cliente[]; 
          this.paginador = response;
        }//Funcion anonima
      );
    });

    //actualiza la foto en la tabla clientes al mismo tiempo que se sube al servidor
    this._modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Eliminar cliente?',
      text: `Quieres eliminar este cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar!',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this._clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(clie => clie != cliente)// Si cliente es distinto al cliente, lo va a mostrar en la nueva lista
            Swal.fire(
              'Cliente eliminado!',
              'El cliente fue eliminado con exito.',
              'success'
            )
          }
        )
      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this._modalService.abrirModal(); 
  }

}
