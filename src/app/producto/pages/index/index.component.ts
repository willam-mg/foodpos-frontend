import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/shared/models/pagination';
import { Producto } from 'src/app/shared/models/producto';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import { HttpService } from '../../services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EditComponent } from '../edit/edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CreateComponent } from '../create/create.component';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  subscription: Subscription;
  submitted: Boolean;
  productos: Array<Producto>;
  responseData: DataResponse;
  pagination: Pagination;
  formProducto: FormGroup;
  @ViewChild(EditComponent) editComponent: any;
  @ViewChild(CreateComponent) CreateComponent: any;

  constructor(
    private httpService: HttpService,
    private title: Title,
    private modalService: NgbModal) {
    this.subscription = new Subscription();
    this.submitted = false;
    this.productos = [];
    this.responseData = new DataResponse();
    this.title.setTitle('Productos');
    this.pagination = new Pagination();

    this.formProducto = new FormGroup({
      nombre: new FormControl(""),
      publicado: new FormControl(false),
      punto_venta_id: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.search();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(): void {
    this.submitted = true;
    let filterSearch = new Producto();
    filterSearch.nombre = this.formProducto.value.nombre;
    filterSearch.publicado = this.formProducto.value.publicado;
    filterSearch.punto_venta_id = this.formProducto.value.punto_venta_id;
    this.subscription.add(
      this.httpService.search(filterSearch, this.pagination).subscribe(data => {
        this.submitted = false;
        this.responseData = data;
        this.productos = this.responseData.data;
        this.pagination.totalCount = data.total;
      })
    );
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditComponent);
    modalRef.componentInstance.setId(id);
    modalRef.componentInstance.isUpdated.subscribe((data: boolean) => {
      Swal.fire(
        'Guardado',
        'los datos se guardaron correctamente',
        'success'
      );
      this.search();
    });
  }

  create() {
    const modalRef = this.modalService.open(CreateComponent);
    modalRef.componentInstance.initForm();
    modalRef.componentInstance.isUpdated.subscribe((data: boolean) => {
      Swal.fire(
        'Guardado',
        'los datos se guardaron correctamente',
        'success'
      );
      this.search();
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Producto',
      text: "¿Eliminar este elemento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.delete(id).subscribe(async (data) => {
          this.search();
          Swal.fire(
            'Eliminado',
            data.message,
            'success'
          )
        });
      }
    })
  }

}
