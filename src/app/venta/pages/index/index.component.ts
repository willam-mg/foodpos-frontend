import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { Title } from '@angular/platform-browser';
import { Pagination } from 'src/app/shared/models/pagination';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Venta } from 'src/app/shared/models/venta';
import { SelectProductoComponent } from 'src/app/venta/components/select-producto/select-producto.component';
import { VentaSearch } from 'src/app/shared/models/filters/venta-search';
import { DetalleVenta } from 'src/app/shared/models/detalle-venta';
import { Producto } from 'src/app/shared/models/producto';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  subscription: Subscription;
  submitted: Boolean;
  ventas: Array<Venta>;
  responseData: DataResponse;
  pagination: Pagination;
  formVenta: FormGroup;
  detalleVenta: Array<DetalleVenta>;

  constructor(
    private httpService: HttpService,
    private title: Title,
    private modalService: NgbModal) {
    this.subscription = new Subscription();
    this.submitted = false;
    this.ventas = [];
    this.responseData = new DataResponse();
    this.title.setTitle('Mis ventas');
    this.pagination = new Pagination();
    this.formVenta = new FormGroup({
      filterFechaInicio: new FormControl(null),
      filterFechaFin: new FormControl(null),
      filterEstado: new FormControl(null),
    });
    this.detalleVenta = [];
  }

  ngOnInit(): void {
    // this.formVenta.controls['filterCliente'].setValue(null);
    // this.formVenta.controls['filterFechaInicio'].setValue(null);
    // this.formVenta.controls['filterFechaFin'].setValue(null);
    // this.formVenta.controls['filterEstado'].setValue(null);
    this.search();
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  search(): void {
    this.submitted = true;
    // this.subscription.add(
      this.httpService.search(this.formVenta.value, this.pagination).subscribe(data => {
        this.submitted = false;
        this.responseData = data;
        this.ventas = this.responseData.data;
        this.pagination.totalCount = data.total;
      })
    // );
  }

  cancelarVenta(id: number) {
    Swal.fire({
      title: 'Ventas',
      text: "¿Cancelar venta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Registrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.httpService.cancelarVenta(id).subscribe(data => {
            this.search();
            Swal.fire(
              'Ventas',
              'Venta fue cancelada',
              'success'
            )
          })
        );
      }
    })
  }

  totalVentas() {
    let suma = 0;
    this.ventas.map((item) => {
      suma += item.total;
    });
    return suma;
  }

  selectProducto(producto: Producto) {
    const modalRef = this.modalService.open(SelectProductoComponent);
    modalRef.componentInstance.setId(producto);
    modalRef.componentInstance.listAditamentos();
    modalRef.componentInstance.isSelected.subscribe((data: DetalleVenta) => {
      console.log(data);
      Swal.fire(
        'Guardado',
        'los datos se guardaron correctamente',
        'success'
      );
      this.search();
    });
  }

}
