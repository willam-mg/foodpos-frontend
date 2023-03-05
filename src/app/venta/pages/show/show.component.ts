import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { HttpService } from '../../services/http.service';
import { AuthService } from 'src/app/auth/service/auth.service';
import Swal from 'sweetalert2';
import { EditComponent } from '../edit/edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Venta } from 'src/app/shared/models/venta';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  subscription: Subscription;
  idVenta: number;
  venta: Venta;
  user: User;
  sucursalName: string;
  @ViewChild(EditComponent) editComponent: any;
  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private authService: AuthService,
    private title: Title,
    private router: Router,
    private modalService: NgbModal) {
    this.subscription = new Subscription();
    this.venta = new Venta();
    this.idVenta = 0;
    this.sucursalName = this.authService.getSucursalName()!;
    this.user = this.authService.getUserIdentity() ? this.authService.getUserIdentity()! : new User();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.idVenta = Number(params['id']);
        this.title.setTitle('Venta ' + this.idVenta);
        this.loadVenta();
      })
    );
  }

  loadVenta() {
    this.subscription.add(
      this.httpService.show(this.idVenta).subscribe(data => {
        this.venta = data;
      })
    );
  }

  totalDetalleVenta() {
    let suma = 0;
    this.venta.detalleVenta.map((item) => {
      let subtotal = item.precio * item.cantidad;
      suma += subtotal;
    });
    return suma;
  }

  printRecibo() {
    this.httpService.printInWindow('recibo');
  }

  cancelarVenta() {
    Swal.fire({
      title: 'Ventas',
      text: "¿Cancelar venta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Registrar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.httpService.cancelarVenta(this.idVenta).subscribe(data => {
            this.loadVenta();
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

  edit() {
    const modalRef = this.modalService.open(EditComponent);
    modalRef.componentInstance.setId(this.idVenta);
    modalRef.componentInstance.isUpdated.subscribe((data: boolean) => {
      Swal.fire(
        'Guardado',
        'los datos se guardaron correctamente',
        'success'
      );
      this.loadVenta();
    });
  }
}
