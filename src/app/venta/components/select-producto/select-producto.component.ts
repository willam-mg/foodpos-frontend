import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { HttpService as ProductoHttpService } from 'src/app/producto/services/http.service';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { Pagination } from 'src/app/shared/models/pagination';
import { Producto } from 'src/app/shared/models/producto';
import { Aditamento } from 'src/app/shared/models/aditamento';
import { DetalleVenta } from 'src/app/shared/models/detalle-venta';
import { AditamentoVenta } from 'src/app/shared/models/aditamento-venta';

@Component({
  selector: 'app-select-producto',
  templateUrl: './select-producto.component.html',
  styleUrls: ['./select-producto.component.css']
})
export class SelectProductoComponent implements OnInit {
  formSearch: FormGroup;
  submitted: boolean;
  subscription: Subscription;
  responseData: DataResponse;
  aditamentos: Array<Aditamento>;
  aditamentosSeleccionados: Array<AditamentoVenta>;
  pagination: Pagination;
  producto: Producto;
  formDetalle: FormGroup;
  @Output()
  isSelected: EventEmitter<DetalleVenta> = new EventEmitter<DetalleVenta>();

  constructor(
    private httpService: ProductoHttpService,
    private modalService: NgbModal,
    public modal: NgbActiveModal) {
    this.submitted = false;
    this.aditamentos = [];
    this.aditamentosSeleccionados = [];
    this.subscription = new Subscription;
    this.responseData = new DataResponse();
    this.pagination = new Pagination();
    this.formSearch = new FormGroup({ 
      nombre: new FormControl(""),
      es_aditamento: new FormControl(true),
    });
    this.producto = new Producto();
    this.formDetalle = this.initForm();
  }

  initForm() {
    this.producto = new Producto();
    this.producto.precio = null;
    return new FormGroup({
      cantidad: new FormControl(1, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    this.listAditamentos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setId(producto: Producto) {
    this.producto = producto;
  }

  listAditamentos() {
    let filterSearch = new Producto();
    filterSearch.nombre = this.formSearch.value.nombre;
    filterSearch.es_aditamento = this.formSearch.value.es_aditamento;
    this.httpService.misAditamentos(this.producto.id!).subscribe((data) => {
      this.aditamentos = data;
      console.log(this.aditamentos);
      // this.pagination.totalCount = data.total;
    });
  }

  // getAditamentos() {
  //   this.subscription.add(
  //     this.httpService.puntosVenta().subscribe(async (data: Array<PuntoVenta>) => {
  //       this.puntosVenta = data;
  //     })
  //   );
  // }

  seleccionar(aditamento: Aditamento) { 
    let exists = this.aditamentosSeleccionados.find(item => item.id == aditamento.id);
    if (exists == undefined) {
      let aditamentoVenta = new AditamentoVenta();
      aditamentoVenta.mi_aditamento = aditamento;
      aditamentoVenta.numero_producto = this.aditamentosSeleccionados.length + 1;
      this.aditamentosSeleccionados.push(aditamentoVenta);
    }
    // this.modal.close();
    // this.isSelected.emit(almacen);
  }



  aceptarDetalleVenta() {
    let detalle = new DetalleVenta();
    detalle.nombre_producto = this.producto.nombre;
    detalle.precio = this.producto.precio!;
    detalle.cantidad = this.formDetalle.controls['cantidad'].value;
    detalle.descuento = 0;
    detalle.gramos = null!;
    detalle.precio_x_gr =  null!;
    detalle.producto = this.producto;
    detalle.subtotal = detalle.cantidad * detalle.precio;
    detalle.aditmanetos_venta = this.aditamentosSeleccionados;
    console.log('before emmit', detalle);
    this.isSelected.emit(detalle);
    this.modal.close();
    // Swal.fire(
    //   'Registrado',
    //   'los datos se actualizaron correctamente',
    //   'success'
    // );
  }

  removeDetalle(id:number) {
    this.aditamentosSeleccionados.map((item, key) => {
      if (item.id === id) {
        this.aditamentosSeleccionados.splice(key, 1);
      }
    });
  }

  lessCantidad() {
    let cantidad = this.formDetalle.controls['cantidad'].value;
    let res = cantidad - 1;
    if (res == 0) {
      res = 1;
    }

    this.formDetalle.controls['cantidad'].setValue(res);
  }

  sumCantidad() {
    let cantidad = this.formDetalle.controls['cantidad'].value;
    let res = cantidad + 1;
    this.formDetalle.controls['cantidad'].setValue(res);
  }
}
