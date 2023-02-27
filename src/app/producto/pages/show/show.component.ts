import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Aditamento } from 'src/app/shared/models/aditamento';
import { Pagination } from 'src/app/shared/models/pagination';
import { Producto } from 'src/app/shared/models/producto';
import { PuntoVenta } from 'src/app/shared/models/punto-venta';
import { DataResponse } from 'src/app/shared/models/response/data-response';
import Swal from 'sweetalert2';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  closeResult = '';
  producto: Producto;
  submitted: boolean;
  formProducto: FormGroup;
  subscription: Subscription;
  puntosVenta: Array<PuntoVenta>;
  responseData: DataResponse;
  productos: Array<Producto>;
  pagination: Pagination;
  aditamentos: Array<Aditamento>;
  id: number;

  @Output()
  isUpdated: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private title: Title) {
    this.id = 0;
    this.submitted = false;
    this.subscription = new Subscription;
    this.puntosVenta = [];
    this.producto = new Producto();
    this.formProducto = this.initForm();
    this.responseData = new DataResponse();
    this.productos = [];
    this.pagination = new Pagination();
    this.aditamentos = [];
  }

  ngOnInit(): void {
    // this.getPuntosVenta();
    this.search();
  }

  initForm(): FormGroup {
    return new FormGroup({
      nombre: new FormControl("", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      // descripcion: new FormControl(this.producto.descripcion, [
      //   Validators.required,
      // ]),
      // foto: new FormControl(this.producto.foto),
      // precio: new FormControl(this.producto.precio, [
      //   Validators.required,
      // ]),
      // precio_x_gr: new FormControl(this.producto.precio_x_gr),
      // es_producto: new FormControl(this.producto.es_producto),
      es_aditamento: new FormControl(true),
      // publicado: new FormControl(this.producto.publicado),
      // punto_venta_id: new FormControl(this.producto.punto_venta_id, [
      //   Validators.required,
      // ]),
      // comentario: new FormControl(this.producto.comentario),
    });
  }

  open(content: any) {
    this.modalService.open(content);
  }

  setId(id: number) {
    this.id = id;
  }

  getProducto() {
    this.subscription.add(
      this.httpService.show(this.id!).subscribe( (data) => {
        this.producto = data;
        this.aditamentos = this.producto.mis_aditamentos;
        this.formProducto = this.initForm();
      })
    );
  }

  // getPuntosVenta() {
  //   this.subscription.add(
  //     this.httpService.puntosVenta().subscribe(async (data: Array<PuntoVenta>) => {
  //       this.puntosVenta = data;
  //     })
  //   );
  // }

  addAditamento(id: number) {
    try {
      this.submitted = true;
      this.subscription.add(
        this.httpService.addAditamento(this.id!, id)
          .subscribe(async () => {
            this.getProducto();
            Swal.fire(
              'Registrado',
              'los datos se registraron correctamente',
              'success'
            );
          })
      );
    } catch (error) {
      console.log(error);
    }
  }

  removeAditamento(id: number) {
    try {
      this.submitted = true;
      this.subscription.add(
        this.httpService.removeAditamento(id)
          .subscribe(async () => {
            this.getProducto();
            Swal.fire(
              'Registrado',
              'los datos se actualizaron correctamente',
              'success'
            );
          })
      );
    } catch (error) {
      console.log(error);
    }
  }


  search(): void {
    this.submitted = true;
    let filterSearch = new Producto();
    filterSearch.nombre = this.formProducto.value.nombre;
    filterSearch.publicado = this.formProducto.value.publicado;
    filterSearch.punto_venta_id = this.formProducto.value.punto_venta_id;
    filterSearch.es_aditamento = this.formProducto.value.es_aditamento;
    this.subscription.add(
      this.httpService.search(filterSearch, this.pagination).subscribe(data => {
        this.submitted = false;
        this.responseData = data;
        this.productos = this.responseData.data;
        this.pagination.totalCount = data.total;
      })
    );
  }

  // onFileChange(event: any) {
  //   const reader = new FileReader();
  //   if (event.target.files && event.target.files.length) {
  //     const [file] = event.target.files;
  //     reader.readAsDataURL(file);
  //     reader.onload = (e: any) => {
  //       this.producto.foto = e.target.result;
  //       this.formProducto.patchValue({
  //         foto: reader.result
  //       });
  //     };
  //   }
  // }

}
