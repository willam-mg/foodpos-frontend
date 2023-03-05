import { Cliente } from "./cliente";
import { DetalleVenta } from "./detalle-venta";
import { User } from "./user";

export class Venta {
    id?: number;
    fecha: string;
    hora: string;
    descuento: number;
    comentario: string;
    estado: number;
    cliente_id: number;
    user_id: number;
    punto_venta_id: number;
    detalleVenta: Array<DetalleVenta>;
    total: number;
    cliente: Cliente;
    user: User;

    constructor() {
        this.fecha = "";
        this.hora = "";
        this.descuento = 0;
        this.comentario = "";
        this.estado = 2;
        this.cliente_id = 0;
        this.user_id = 0;
        this.punto_venta_id = 0;
        this.total = 0;
        this.detalleVenta = [];
        this.cliente = new Cliente();
        this.user = new User();
    }
}
