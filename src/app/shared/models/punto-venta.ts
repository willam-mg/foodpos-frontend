export class PuntoVenta {
    id?: number;
    restaurante: string;
    nombre_punto_venta: string;
    foto: string;
    direccion: string;
    telefono: string;
    telefono_pedidos: string;
    hora_apertura: string;
    hora_cierre: string;

    constructor() {
        this.restaurante = ""
        this.nombre_punto_venta = ""
        this.foto = ""
        this.direccion = ""
        this.telefono = ""
        this.telefono_pedidos = ""
        this.hora_apertura = ""
        this.hora_cierre = ""
    }
}
