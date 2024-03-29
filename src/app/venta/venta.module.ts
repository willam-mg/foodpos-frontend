import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaRoutingModule } from './venta-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { CreateComponent } from './pages/create/create.component';
import { ReciboComponent } from './pages/recibo/recibo.component';
import { EditComponent } from './pages/edit/edit.component';
import { SelectProductoComponent } from './components/select-producto/select-producto.component';
import {
  NgbActiveModal,
  NgbDatepickerModule,
  NgbModule,
  NgbPaginationModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShowComponent } from './pages/show/show.component';

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    ReciboComponent,
    SelectProductoComponent,
    EditComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    VentaRoutingModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule,
    RouterModule
  ]
})
export class VentaModule { }
