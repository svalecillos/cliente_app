import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../service/cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  cliente: Cliente;

  titulo: string = "Detalle del cliente";
  private fotoSeleccionada: File;

  constructor( private _clienteService: ClienteService, 
                private activatedRote: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRote.paramMap.subscribe(params => {
      let id:number = +params.get('id'); //Convertimos el id en un tipo number, con el signo +
      if(id){
        //Obtenemos el cliente
        this._clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente = cliente;
        })
      }
    });
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
  }

  subirFoto(){
    this._clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(cliente => {
        this.cliente = cliente;
        Swal.fire('La foto ha subido correctamente', `La foto se ha subido con exito: ${this.cliente.foto}`, 'success');
      }
    );
  }

}
