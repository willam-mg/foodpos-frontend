import { environment } from "src/environments/environment";
import { Aditamento } from "./aditamento";
import { CategoriaProducto } from "./categoria-producto";
import { PuntoVenta } from "./punto-venta";

export class Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    src_foto: string;
    precio: number | null;
    precio_x_gr: boolean;
    es_producto: boolean;
    es_aditamento: boolean;
    publicado: boolean
    punto_venta_id: number;
    comentario: string;
    categoria_producto_id: number;
    foto: string;
    foto_thumbnail: string;
    foto_thumbnail_sm: string;
    punto_venta: PuntoVenta;
    foto_preview?: string;
    mis_aditamentos: Array<Aditamento>;
    mi_categoria: CategoriaProducto;

    constructor() {
        this.nombre = "";
        this.descripcion = "";
        this.src_foto = "";
        this.precio = 0;
        this.precio_x_gr = false;
        this.es_producto = true;
        this.es_aditamento = false;
        this.publicado = true;
        this.punto_venta_id = 0;
        this.comentario = "";
        this.categoria_producto_id = 0;
        this.foto = "";
        this.foto_thumbnail = "";
        this.foto_thumbnail_sm = "";
        this.punto_venta = new PuntoVenta();
        this.mis_aditamentos = [];
        this.mi_categoria = new CategoriaProducto();
    }
}
