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
}