import { Producto } from './producto';

export class ItemsFactura {

    producto: Producto;
    cantidad: number = 1;
    importe: number;

    public calcularImporte():number{
        return this.cantidad*this.producto.precio;
    }

}