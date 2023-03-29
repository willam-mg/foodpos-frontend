import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Title } from '@angular/platform-browser';
import { Pagination } from 'src/app/shared/models/pagination';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SelectProductoComponent } from '../../components/select-producto/select-producto.component';
import { HttpService as ProductoHttpService } from 'src/app/producto/services/http.service';
import { HttpService as CategoriaHttpService } from 'src/app/categoria-producto/services/http.service';
import { DetalleVenta } from 'src/app/shared/models/detalle-venta';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Venta } from 'src/app/shared/models/venta';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { Producto } from 'src/app/shared/models/producto';
import { CategoriaProducto } from 'src/app/shared/models/categoria-producto';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  subscription: Subscription;
  submitted: Boolean;
  almacen: Producto;
  responseData: DataResponse;
  pagination: Pagination;
  formVenta: FormGroup;
  formSearch: FormGroup;
  detalleVenta: Array<DetalleVenta>;
  inputCantidad: number;
  fieldObservacion: string;
  venta: Venta;
  inputEfectivo: number;
  inputCambio: number;
  inputFecha: string;
  inputHora: string;
  productos: Array<Producto>;
  categorias: Array<CategoriaProducto>;
  numerToShow: number;
  puntoVentaId: number;
  @ViewChild(SelectProductoComponent) selectProductoComponent: any;

  constructor(
    private title: Title,
    private router: Router,
    private modalCliente: NgbModal,
    private modalProducto: NgbModal,
    private httpService: HttpService,
    private productoHttpService:ProductoHttpService,
    private categoriaHttpService: CategoriaHttpService) {
    this.title.setTitle('Nueva venta');
    this.responseData = new DataResponse();
    this.subscription = new Subscription();
    this.submitted = false;
    this.pagination = new Pagination();
    this.almacen = new Producto();
    this.formVenta = new FormGroup({
      fieldSearch: new FormControl(""),
    });
    this.formSearch = new FormGroup({
      nombre: new FormControl(""),
      categoria_producto_id: new FormControl(""),
    });
    this.detalleVenta = [];
    this.inputCantidad = 1;
    this.fieldObservacion = "";
    this.venta = new Venta();
    this.puntoVentaId = 1;
    this.inputEfectivo = 0;
    this.inputCambio = 0;
    this.inputFecha = moment().format('YYYY-MM-DD');
    this.inputHora = moment().format('hh:mm');
    this.productos = [];
    this.categorias = [];
    this.numerToShow = 6;
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchProducto() {

  }

  selectProducto(producto: Producto) {
    const modalRefProducto = this.modalProducto.open(SelectProductoComponent, { size: 'xl' });
    modalRefProducto.componentInstance.setId(producto);
    modalRefProducto.componentInstance.isSelected.subscribe((data: DetalleVenta) => {
      console.log('after emmit', data);
      this.detalleVenta.push(data);
      // this.almacen = data;
      // this.addDetalleVenta(this.almacen);
    });
  }
  
  // searchByCodeBar() {
  //   this.submitted = true;
  //   this.subscription.add(
  //     this.productoHttpService.getByCodeBar(this.formSearch.value.codeBar)
  //       .pipe(
  //         catchError((error: HttpErrorResponse) => {
  //           let errorMessage = error.error.message;
  //           Swal.fire(
  //             '',
  //             errorMessage,
  //             'warning'
  //           );
  //           this.submitted = false;
  //           this.formSearch.reset();
  //           return throwError(errorMessage);
  //         })
  //       )
  //       .subscribe(data => {
  //         this.submitted = false;
  //         this.almacen = data;
  //         this.addDetalleVenta(this.almacen);
  //         this.formSearch.reset();
  //       })
  //   );
  // }

  existsInDetalleVenta(detalle:DetalleVenta) {
    let exists = false;
    this.detalleVenta.forEach((item) => {
      if (item.producto.id == detalle.producto.id) {
        exists = true;
      }
    });
    return exists;
  }

  addDetalleVenta(almacen: Producto) {
    // let detalle = new DetalleVenta();
    // detalle.almacen_id = this.almacen.id!;
    // detalle.producto_id = this.almacen.producto.id!;
    // detalle.precio = this.almacen.producto.precio;
    // detalle.almacen = this.almacen;
    // detalle.cantidad = this.inputCantidad;

    // if (this.existsInDetalleVenta(detalle)) {
    //   this.detalleVenta.forEach((item) => {
    //     if (item.almacen.id == detalle.almacen.id) {
    //       let cantidadDisponible = item.almacen.cantidad;
    //       let cantidadRequerida = item.cantidad + detalle.cantidad;
    //       if (cantidadDisponible >= cantidadRequerida) {
    //         item.cantidad += detalle.cantidad;
    //       } else {
    //         Swal.fire(
    //           'Stock',
    //           'La cantidad sobrepasa el stock',
    //           'warning'
    //         );
    //       }
    //     }
    //   });
    // } else {
    //   this.detalleVenta.push(detalle);
    // }
  }

  removeDetalle(detalle:DetalleVenta) {
    const index = this.detalleVenta.indexOf(detalle);
    if (index > -1) {
      this.detalleVenta.splice(index, 1);
    }
  }

  totalDetalleVenta() {
    let suma = 0;
    this.detalleVenta.map((item) => {
      suma += item.subtotal;
    });
    return suma;
  }

  registrarVenta() {
    Swal.fire({
      title: 'Ventas',
      text: "¿Registrar venta?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Registrar'
    }).then((result) => {
      if (result.isConfirmed) {
        // llenando detalle de venta
        let detalle = this.detalleVenta.map(item=>{
          let detalleAditamento = item.aditamentos_venta.map(aditItem => {
            return {
              numero_producto: aditItem.numero_producto,
              aditamento_id: aditItem.mi_aditamento.id!
            }
          });
          return {
            producto_id: item.producto.id!,
            cantidad: item.cantidad,
            descuento: item.descuento,
            gramos: item.gramos,
            aditamentos_venta: detalleAditamento
          };
        });

        let body = {
          comentario: this.fieldObservacion,
          detalleVenta: detalle,
          fecha: this.inputFecha,
          punto_venta_id: this.puntoVentaId
        };
  
        // this.venta.comentario = this.fieldObservacion;
        // this.venta.detalleVenta = detalle;
        // this.venta.fecha = this.inputFecha;
        // this.venta.punto_venta_id = this.puntoVentaId;
        // this.venta.hora = this.inputHora;
        this.httpService.create(body)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              let errorMessage = error.error.message;
              Swal.fire(
                '',
                errorMessage,
                'warning'
              );
              this.submitted = false;
              this.formSearch.reset();
              return throwError(errorMessage);
            })
          ).subscribe(async (data) => {
            Swal.fire(
              'Ventas',
              'Fue registrado satisfactoriamente',
              'success'
            )
            this.venta = data;
            this.router.navigate(['/ventas/recibo'], {
              queryParams:
              {
                id: this.venta.id
              }
            });
          });
      }
    })
  }

  calcCambio() {
    let total = this.totalDetalleVenta();
    if (this.inputEfectivo >= total && total > 0 ) {
      this.inputCambio = this.inputEfectivo - total;
    }
  }

  getCategorias() { 
    this.categoriaHttpService.getCategorias().subscribe((data) => {
      this.categorias = data;
      this.search();
    });
  }

  search() {
    let filterSearch = new Producto();
    // nombre
    // categoria_producto_id
    filterSearch.nombre = this.formSearch.value.nombre;
    filterSearch.categoria_producto_id = this.formSearch.value.categoria_producto_id;
    // filterSearch.publicado = this.formSearch.value.publicado;
    // filterSearch.es_aditamento = this.formSearch.value.es_aditamento;
    this.productoHttpService.search(this.formSearch.value, this.pagination).subscribe((data) => {
      this.responseData = data;
      this.productos = this.responseData.data;
      this.pagination.totalCount = data.total;
    });
  }

  agregar() {

  }

  remove(id:number) {
    
  }



}
