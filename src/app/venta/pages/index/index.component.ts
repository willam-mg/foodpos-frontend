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
import { VentaSearch } from 'src/app/shared/models/filters/venta-search';


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
      filterCliente: new FormControl(this.httpService.filterSearch.cliente),
      filterFechaInicio: new FormControl(this.httpService.filterSearch.cliente),
      filterFechaFin: new FormControl(this.httpService.filterSearch.cliente),
      filterEstado: new FormControl(this.httpService.filterSearch.cliente),
    });
  }

  ngOnInit(): void {
    console.log(this.httpService.filterSearch);
    this.formVenta.controls['filterCliente'].setValue(this.httpService.filterSearch.cliente);
    this.formVenta.controls['filterFechaInicio'].setValue(this.httpService.filterSearch.fechaInicio);
    this.formVenta.controls['filterFechaFin'].setValue(this.httpService.filterSearch.fechaFin);
    this.formVenta.controls['filterEstado'].setValue(this.httpService.filterSearch.estado);
    this.search();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(): void {
    this.submitted = true;
    this.subscription.add(
      this.httpService.search(this.formVenta.value, this.pagination).subscribe(data => {
        this.submitted = false;
        this.responseData = data;
        this.ventas = this.responseData.data;
        this.pagination.totalCount = data.total;
      })
    );
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

}
