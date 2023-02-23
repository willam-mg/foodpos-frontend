import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { Producto } from 'src/app/shared/models/producto';
import { PuntoVenta } from 'src/app/shared/models/punto-venta';
import Swal from 'sweetalert2';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
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
    this.producto = new Producto();
    this.formProducto = this.initForm();
    this.submitted = false;
    this.subscription = new Subscription;
    this.puntosVenta = [];
  }

  ngOnInit(): void {
    this.getPuntosVenta();
  }

  initForm(): FormGroup {
    this.producto = new Producto();
    this.producto.precio = null;
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

  getPuntosVenta() {
    this.subscription.add(
      this.httpService.puntosVenta().subscribe(async (data:Array<PuntoVenta>) => {
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
        this.httpService.create(this.formProducto.value)
          .subscribe(async () => {
            this.producto = new Producto();
            this.formProducto = this.initForm();
            this.activeModal.close();
            this.isUpdated.emit(true);
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

  onFileChange(event:any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.producto.foto = e.target.result;
        this.formProducto.patchValue({
          foto: reader.result
        });
      };
    }
  }
}
