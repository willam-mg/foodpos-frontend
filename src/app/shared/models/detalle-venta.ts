import { AditamentoVenta } from "./aditamento-venta";
import { Producto } from "./producto";

export class DetalleVenta {
    id?: number;
    nombre_producto: string;
    precio_x_gr: boolean;
    precio: number;
    cantidad: number;
    descuento: number;
    gramos: number;
    venta_id: number;
    producto_id: number;
    producto: Producto;
    subtotal: number;
    aditmanetos_venta: Array<AditamentoVenta>;

    constructor() {
        this.nombre_producto = "";
        this.precio_x_gr = false;
        this.precio = 0;
        this.cantidad = 0;
        this.descuento = 0;
        this.gramos = 0;
        this.venta_id = 0;
        this.producto_id = 0;
        this.producto = new Producto();
        this.subtotal = 0;
        this.aditmanetos_venta = [];
    }

    getSubtotal() {
        return this.precio * this.cantidad;
    }
}
