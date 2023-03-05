import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Venta } from 'src/app/shared/models/venta';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  model: Venta;
  formUser: FormGroup;
  submitted: boolean;
  subscription: Subscription;
  @Output()
  isUpdated: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private httpService: HttpService,
    public activeModal: NgbActiveModal) {
    this.model = new Venta();
    this.formUser = new FormGroup({
      fecha: new FormControl("", [
        Validators.required
      ]),
      hora: new FormControl("", [
        Validators.required
      ]),
      observacion: new FormControl(""),
    });
    this.submitted = false;
    this.subscription = new Subscription;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setId(id: number) {
    this.httpService.show(id).subscribe(async (data) => {
      this.model = data;
      this.formUser.setValue({
        fecha: this.model.fecha,
        hora: this.model.hora,
        observacion: this.model.comentario
      });
    });
  }

  onSubmit() {
    try {
      if (this.formUser.invalid) {
        throw new Error('Entrada de datos invalido');
      }
      this.submitted = true;
      this.subscription.add(
        this.httpService.update(this.model.id!, this.formUser.value)
          .subscribe(async () => {
            this.submitted = false;
            this.model = new Venta();
            this.activeModal.close();
            this.isUpdated.emit(true);
          })
      );
    } catch (error) {
      throw error;
    }
  }

}
