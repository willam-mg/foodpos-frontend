import { PuntoVenta } from "./punto-venta";

export class Cliente {
    id?: number;
    nombre_razon_social: string;
    ci_nit: string;
    punto_venta_id: number;
    puntoVenta: PuntoVenta;

    constructor() {
        this.nombre_razon_social = "";
        this.ci_nit = "";
        this.punto_venta_id = 0;
        this.puntoVenta = new PuntoVenta();
    }
}
