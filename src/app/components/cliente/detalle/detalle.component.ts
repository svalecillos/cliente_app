import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../service/cliente.service';
import { ModalService } from '../../../service/modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';
import { FacturasService } from 'src/app/service/facturas.service';
import { Factura } from 'src/app/model/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;

  titulo: string = "Detalle del cliente";
  private fotoSeleccionada: File;

  constructor( private _clienteService: ClienteService,
                private _facturaService: FacturasService,
                private _authService: AuthService,
                private _modalService: ModalService) { }

  ngOnInit() {
    /*this.activatedRote.paramMap.subscribe(params => {
      let id:number = +params.get('id'); //Convertimos el id en un tipo number, con el signo +
      if(id){
        //Obtenemos el cliente
        this._clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente = cliente;
        })
      }
    });*/
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      Swal.fire('Error Upload:', 'Debe seleccionar una foto', 'error');
    }else{
      this._clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this._modalService.notificarUpload.emit(this.cliente);
            Swal.fire('La foto ha subido correctamente', `La foto se ha subido con exito: ${this.cliente.foto}`, 'success');
          }
      });
    }
  }

  cerrarModal(){
    this._modalService.cerrarModal();
    this.fotoSeleccionada = null;
  }

  delete(factura: Factura): void {
    Swal.fire({
      title: 'Eliminar cliente?',
      text: `Quieres eliminar la factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar!',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this._facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(fac => fac != factura)// Si cliente es distinto al cliente, lo va a mostrar en la nueva lista
            Swal.fire(
              'Factura eliminada!',
              'la factura fue eliminado con exito.',
              'success'
            )
          }
        )
      }
    })
  }
}
