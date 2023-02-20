import { PuntoVenta } from "./punto-venta";

export class User {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: string;
    foto?: string;
    password_confirmation?: string;
    turno: string;
    punto_venta_id?: number;
    punto_venta?: PuntoVenta;

    constructor() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.role = '';
        this.foto = '';
        this.turno = '';
        this.punto_venta_id = 0;
        this.punto_venta = new PuntoVenta();
    }
}
