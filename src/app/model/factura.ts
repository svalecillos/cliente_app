import { ItemsFactura } from './itemsFactura';
import { Cliente } from './cliente';

export class Factura {
    id:number;
    descripcion:string;
    observacion:string;
    items:Array<ItemsFactura> = [];
    cliente:Cliente;
    total:number;
    createAt:string;

    calcularTotal(): number{
        this.total = 0;
        //con forEach recorremos todos los elementos para sumar la cantidad
        this.items.forEach((item:ItemsFactura) => {
            this.total += item.calcularImporte();
            //this.total = this.total + item.calcularImporte();
        });
        return this.total;
    }
}