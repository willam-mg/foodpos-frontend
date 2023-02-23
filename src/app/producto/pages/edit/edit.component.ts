import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/shared/models/producto';
import { PuntoVenta } from 'src/app/shared/models/punto-venta';
import Swal from 'sweetalert2';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  closeResult = '';
  producto: Producto;
  submitted: boolean;
  formProducto: FormGroup;
  subscription: Subscription;
  puntosVenta: Array<PuntoVenta>;
  @Output()
  isUpdated: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private title: Title) {
    this.submitted = false;
    this.subscription = new Subscription;
    this.puntosVenta = [];
    this.producto = new Producto();
    this.formProducto = this.initForm();
  }

  ngOnInit(): void {
    this.getPuntosVenta();
  }

  initForm(): FormGroup {
    return new FormGroup({
      nombre: new FormControl(this.producto.nombre, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      descripcion: new FormControl(this.producto.descripcion, [
        Validators.required,
      ]),
      foto: new FormControl(this.producto.foto),
      precio: new FormControl(this.producto.precio, [
        Validators.required,
      ]),
      precio_x_gr: new FormControl(this.producto.precio_x_gr),
      es_producto: new FormControl(this.producto.es_producto),
      es_aditamento: new FormControl(this.producto.es_aditamento),
      publicado: new FormControl(this.producto.publicado),
      punto_venta_id: new FormControl(this.producto.punto_venta_id, [
        Validators.required,
      ]),
      comentario: new FormControl(this.producto.comentario),
    });
  }

  open(content: any) {
    this.modalService.open(content);
  }

  setId(id: number) {
    this.producto.id = id;
  }

  getProducto() {
    this.subscription.add(
      this.httpService.show(this.producto.id!).subscribe(async (data: Producto) => {
        this.producto = data;
        this.producto.foto_preview = this.producto.foto;
        this.producto.foto = "";
        this.formProducto = this.initForm();
      })
    );
  }

  getPuntosVenta() {
    this.subscription.add(
      this.httpService.puntosVenta().subscribe(async (data: Array<PuntoVenta>) => {
        this.puntosVenta = data;
      })
    );
  }

  onSubmit() {
    console.log('ingresando');
    try {
      if (this.formProducto.invalid) {
        throw new Error('Entrada de datos invalido');
      }
      this.submitted = true;
      this.subscription.add(
        this.httpService.update(this.producto.id!, this.formProducto.value)
          .subscribe(async () => {
            this.producto = new Producto();
            this.formProducto = this.initForm();
            this.activeModal.close();
            this.isUpdated.emit(true);
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

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.producto.foto = e.target.result;
        this.producto.foto_preview = e.target.result;
        this.formProducto.patchValue({
          foto: reader.result
        });
      };
    }
  }
}
