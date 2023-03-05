import { Venta } from "../venta";

export class VentaSearch extends Venta {
    fechaInicio: string;
    fechaFin: string;

    constructor() {
        super();
        this.fechaInicio = "";
        this.fechaFin = "";
    }
}
