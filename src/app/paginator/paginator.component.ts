import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;

  paginas: number[];

  desde: number;
  hasta: number;

  constructor() { }

  ngOnInit() {
    this.initPaginator();
  }

  ngOnChanges(changes:SimpleChanges){  
    let paginadorActualizado = changes['paginador'];
    
    if(paginadorActualizado.previousValue){
      this.initPaginator();
    } 
  }

  private initPaginator():void {

    this.desde = Math.min(Math.max(1, this.paginador.number-4), this.paginador.totalPages-5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number+4), 6);

    console.log(this.desde);
    console.log(this.hasta);

    if(this.paginador.totalPages>5){
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((valor, indice) => indice + this.desde);
    }else {
      //Usamos el fill() para llenar todo el arreglo
      //Lugo el map() para modificar el 0 por los numeros de paginas
      console.log("Hola "+this.paginador.number);
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice +1);
    }

  }

}
