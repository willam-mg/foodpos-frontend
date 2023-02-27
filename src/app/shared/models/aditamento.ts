import { Producto } from "./producto";

export class Aditamento {
    id?: number;
    descripcion: string;
    producto_id: number;
    aditamento_id: number;
    numero_producto: number;
    mi_aditamento: Producto;
    mi_producto: Producto;

    constructor() {
        this.descripcion = ""
        this.producto_id = 0;
        this.aditamento_id = 0;
        this.numero_producto = 1;
        this.mi_aditamento = new Producto();
        this.mi_producto = new Producto();

    }
}
