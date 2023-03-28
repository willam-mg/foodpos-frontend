import { Aditamento } from "./aditamento";
import { DetalleVenta } from "./detalle-venta";

export class AditamentoVenta {
    id?: number;
    numero_producto: number;
    detalle_venta_id: number;
    aditamento_id: number;
    mi_aditamento: Aditamento;
    mi_detalle_venta: DetalleVenta;

    constructor() {
        this.numero_producto = 0;
        this.detalle_venta_id = 0;
        this.aditamento_id = 0;
        this.mi_aditamento = new Aditamento();
        this.mi_detalle_venta = new DetalleVenta();
    }
}
